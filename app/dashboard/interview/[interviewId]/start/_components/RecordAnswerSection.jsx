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

  // Track final answer separately from interim results
  const finalAnswerRef = useRef('');
  const interimResultsRef = useRef('');

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
    timeout: 3000, // Shorter timeout for mobile
  });

  useEffect(() => {
    if (error) {
      toast.error(`Speech recognition error: ${error}`);
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    if (results.length === 0) return;

    // Separate final and interim results
    const newFinalResults = results
      .filter(r => r.isFinal)
      .map(r => r.transcript.trim())
      .filter(t => t.length > 0);

    // Get the latest interim result
    const latestInterim = results
      .filter(r => !r.isFinal)
      .slice(-1)[0]?.transcript || '';

    // Update final answer if we have new finalized chunks
    if (newFinalResults.length > 0) {
      finalAnswerRef.current = `${finalAnswerRef.current} ${newFinalResults.join(' ')}`.trim();
    }

    // Update interim results
    interimResultsRef.current = latestInterim;

    // Combine for display
    const displayText = `${finalAnswerRef.current} ${interimResultsRef.current}`.trim();
    setUserAnswer(displayText);
  }, [results]);

  const handleRecordingToggle = async () => {
    if (isRecording) {
      setLoading(true);
      try {
        await stopSpeechToText();
        // Wait a brief moment for any final results to come in
        await new Promise(resolve => setTimeout(resolve, 500));
        setShouldSubmit(true);
      } catch (err) {
        console.error('Error stopping recording:', err);
        setLoading(false);
      }
    } else {
      // Reset for new recording
      finalAnswerRef.current = '';
      interimResultsRef.current = '';
      setUserAnswer('');
      setResults([]);
      try {
        await startSpeechToText();
      } catch (err) {
        console.error('Error starting recording:', err);
        toast.error('Failed to start recording. Please check microphone permissions.');
      }
    }
  };

  const handleAnswerSubmission = async () => {
    const finalAnswer = finalAnswerRef.current.trim();
    
    if (finalAnswer.length < 10) {
      toast.error('Please provide a more detailed answer (at least 10 characters).');
      setLoading(false);
      return;
    }

    try {
      const feedbackPrompt = `Question: ${mockInterviewQuestion.questions[activeQuestionIndex]},
        User Answer: ${finalAnswer}.
        Please evaluate this answer and provide:
        1. A rating from 1-10
        2. Specific feedback on how to improve
        Return as JSON: { "rating": number, "feedback": string }`;

      const result = await chatSession.sendMessage(feedbackPrompt);
      const response = await result.response.text();
      
      // More robust JSON extraction
      let jsonResponse;
      try {
        // First try to parse directly
        jsonResponse = JSON.parse(response);
      } catch {
        // Fallback to extracting JSON from markdown or other formats
        const jsonMatch = response.match(/\{[\s\S]*?\}/);
        if (jsonMatch) jsonResponse = JSON.parse(jsonMatch[0]);
      }

      if (!jsonResponse?.rating || !jsonResponse?.feedback) {
        throw new Error('Invalid feedback format');
      }

      await db.insert(UserAnswer).values({
        mockId: interviewId,
        question: mockInterviewQuestion.questions[activeQuestionIndex],
        correctAnswer: mockInterviewQuestion.answers[activeQuestionIndex],
        userAnswer: finalAnswer,
        rating: Number(jsonResponse.rating),
        feedback: jsonResponse.feedback,
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
        createdBy: user?.primaryEmailAddress?.emailAddress || 'unknown',
      });

      toast.success("Answer saved successfully!");
      setUserAnswer('');
    } catch (err) {
      console.error('Submission error:', err);
      toast.error("Error processing feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shouldSubmit && !isRecording) {
      handleAnswerSubmission();
      setShouldSubmit(false);
    }
  }, [shouldSubmit, isRecording]);

  return (
    <div className='flex flex-col items-center gap-5'>
      <div className='flex flex-col items-center justify-center bg-black rounded-lg p-5 mt-20 relative'>
        <Image
          src="/webcam.png"
          alt="Webcam placeholder"
          width={200}
          height={200}
          className='absolute'
          priority
        />
        <Webcam
          mirrored
          style={{
            width: '100%',
            height: 300,
            zIndex: 10,
          }}
          videoConstraints={{
            facingMode: 'user',
            width: { ideal: 640 },
            height: { ideal: 480 },
          }}
        />
      </div>

      <div className="w-full max-w-2xl p-4 bg-gray-100 rounded-lg min-h-20">
        <h3 className="font-semibold mb-2">Your Answer:</h3>
        <p className="whitespace-pre-wrap">{userAnswer || '...'}</p>
      </div>

      <Button 
        disabled={loading}
        variant={isRecording ? "destructive" : "outline"}
        className='my-5 gap-2 min-w-40'
        onClick={handleRecordingToggle}
      >
        {isRecording ? (
          <>
            <Mic className="animate-pulse" />
            <span>Stop Recording</span>
          </>
        ) : loading ? (
          'Processing...'
        ) : (
          <>
            <Mic />
            <span>Record Answer</span>
          </>
        )}
      </Button>
    </div>
  );
}

export default RecordAnswerSection;