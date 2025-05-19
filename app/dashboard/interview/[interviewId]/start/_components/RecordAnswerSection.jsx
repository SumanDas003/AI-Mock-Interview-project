'use client';
import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic } from 'lucide-react';
import { toast } from 'sonner';
import { chatSession } from '@/utils/GeminiAIModel';
import { useUser } from '@clerk/nextjs';
import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import { useParams } from 'next/navigation';
import moment from 'moment';

function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex }) {
  const params = useParams();
  const [userAnswer, setUserAnswer] = useState('');
  const [shouldSubmit, setShouldSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const interviewId = params.interviewId;
  const { user } = useUser();

  // Track the last processed result index to avoid duplicates
  const lastProcessedIndexRef = useRef(-1);
  const finalTranscriptRef = useRef('');

  const {
    error,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
    timeout: 5000, // Add timeout to prevent hanging
  });

  useEffect(() => {
    if (error) {
      toast.error(`Speech recognition error: ${error}`);
    }
  }, [error]);

  useEffect(() => {
    if (results.length === 0 || results.length <= lastProcessedIndexRef.current) {
      return;
    }

    // Process only new results
    const newResults = results.slice(lastProcessedIndexRef.current + 1);
    lastProcessedIndexRef.current = results.length - 1;

    // Combine all transcripts
    const newTranscript = newResults
      .map(r => r.transcript.trim())
      .filter(t => t.length > 0)
      .join(' ');

    if (newTranscript) {
      finalTranscriptRef.current = `${finalTranscriptRef.current} ${newTranscript}`.trim();
      setUserAnswer(finalTranscriptRef.current);
    }
  }, [results]);

  useEffect(() => {
    if (shouldSubmit && !isRecording && userAnswer) {
      handleAnswerSubmission();
      setShouldSubmit(false);
    }
  }, [userAnswer, isRecording, shouldSubmit]);

  const toggleRecording = () => {
    if (isRecording) {
      setLoading(true);
      stopSpeechToText();
      setShouldSubmit(true);
    } else {
      // Reset state for new recording
      lastProcessedIndexRef.current = -1;
      finalTranscriptRef.current = '';
      setUserAnswer('');
      setResults([]);
      startSpeechToText();
    }
  };

  const handleAnswerSubmission = async () => {
    if (!userAnswer || userAnswer.trim().length < 10) {
      toast.error('Please provide a more detailed answer (at least 10 characters).');
      setLoading(false);
      return;
    }

    const feedbackPrompt = `
      Question: ${mockInterviewQuestion.questions[activeQuestionIndex]},
      User Answer: ${userAnswer}.
      Based on the question and answer, provide a JSON response with:
      {
        "rating": "number out of 10",
        "feedback": "constructive advice in 3-5 lines"
      }
      Return only the JSON object, no additional text or markdown.
    `;

    try {
      const result = await chatSession.sendMessage(feedbackPrompt);
      const responseText = await result.response.text();
      
      // More robust JSON parsing
      let jsonResponse;
      try {
        // Try to parse directly first
        jsonResponse = JSON.parse(responseText);
      } catch (e) {
        // Fallback to extracting from code block if direct parse fails
        const jsonMatch = responseText.match(/{[\s\S]*?}/);
        if (jsonMatch) {
          jsonResponse = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Could not parse AI response');
        }
      }

      if (!jsonResponse.rating || !jsonResponse.feedback) {
        throw new Error('Invalid feedback format');
      }

      await db.insert(UserAnswer).values({
        mockId: interviewId,
        question: mockInterviewQuestion.questions[activeQuestionIndex],
        correctAnswer: mockInterviewQuestion.answers[activeQuestionIndex],
        userAnswer,
        rating: Number(jsonResponse.rating),
        feedback: jsonResponse.feedback,
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
        createdBy: user?.primaryEmailAddress?.emailAddress || 'unknown',
      });

      toast.success("Answer saved successfully!");
      setResults([]);
      setUserAnswer('');
      finalTranscriptRef.current = '';
    } catch (err) {
      console.error('Submission error:', err);
      toast.error("Error processing feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center gap-5'>
      <div className='flex flex-col items-center justify-center bg-black rounded-lg p-5 mt-20 relative'>
        <Image
          src="/webcam.png"
          alt="Webcam"
          width={200}
          height={200}
          className='absolute'
          priority // Add priority for mobile performance
        />
        <Webcam
          mirrored
          style={{
            width: '100%',
            height: 300,
            zIndex: 10,
          }}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          }}
        />
      </div>

      {userAnswer && (
        <div className="w-full max-w-2xl p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">Your Answer:</h3>
          <p>{userAnswer}</p>
        </div>
      )}

      <Button 
        disabled={loading} 
        variant="outline" 
        className='my-5' 
        onClick={toggleRecording}
      >
        {isRecording ? (
          <h2 className='text-red-600 flex gap-2 animate-pulse'>
            <Mic /> Recording...
          </h2>
        ) : loading ? (
          'Processing...'
        ) : (
          'Record Answer'
        )}
      </Button>
    </div>
  );
}

export default RecordAnswerSection;