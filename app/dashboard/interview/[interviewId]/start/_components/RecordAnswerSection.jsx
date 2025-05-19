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
  const interviewId = params.interviewId;
  const { user } = useUser();
  const [userAnswer, setUserAnswer] = useState('');
  const [shouldSubmit, setShouldSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const lastFinalTranscript = useRef('');

  const {
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  // Append only new final results
  useEffect(() => {
    if (results.length === 0) return;

    const latest = results[results.length - 1].transcript.trim();

    if (latest && !lastFinalTranscript.current.endsWith(latest)) {
      setUserAnswer((prev) => {
        const updated = prev.trim() + ' ' + latest;
        lastFinalTranscript.current = updated;
        return updated.trim();
      });
    }
  }, [results]);

  // Handle submission trigger after recording stops
  useEffect(() => {
    if (shouldSubmit && !isRecording) {
      handleAnswerSubmission();
      setShouldSubmit(false);
    }
  }, [shouldSubmit, isRecording]);

  const SaveUserAnswer = () => {
    if (isRecording) {
      setLoading(true);
      stopSpeechToText();
      setShouldSubmit(true);
    } else {
      setUserAnswer('');
      lastFinalTranscript.current = '';
      setResults([]);
      startSpeechToText();
    }
  };

  const handleAnswerSubmission = async () => {
    if (userAnswer.trim().length < 10) {
      toast.error('Please speak a bit more clearly or longer.');
      return;
    }

    const prompt = `
      Question: ${mockInterviewQuestion.questions[activeQuestionIndex]},
      User Answer: ${userAnswer}.
      Based on the question and answer, give a JSON response with:
      {
        "rating": "number out of 10",
        "feedback": "constructive advice in 3-5 lines"
      }
    `;

    try {
      const result = await chatSession.sendMessage(prompt);
      const text = await result.response.text();
      const match = text.match(/```json\s*([\s\S]*?)\s*```/);

      if (match?.[1]) {
        const parsed = JSON.parse(match[1].trim());

        await db.insert(UserAnswer).values({
          mockId: interviewId,
          question: mockInterviewQuestion.questions[activeQuestionIndex],
          correctAnswer: mockInterviewQuestion.answers[activeQuestionIndex],
          userAnswer,
          rating: Number(parsed.rating),
          feedback: parsed.feedback,
          createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
          createdBy: user?.primaryEmailAddress.emailAddress,
        });

        toast.success('Answer saved successfully!');
        setUserAnswer('');
        setResults([]);
        lastFinalTranscript.current = '';
      } else {
        toast.error('Could not parse feedback from AI.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error processing feedback.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center gap-5'>
      <div className='flex flex-col items-center justify-center bg-black rounded-lg p-5 mt-20 relative'>
        <Image
          src='/webcam.png'
          alt='Webcam'
          width={200}
          height={200}
          className='absolute'
        />
        <Webcam
          mirrored
          style={{ width: '100%', height: 300, zIndex: 10 }}
        />
      </div>

      <Button
        disabled={loading}
        variant='outline'
        className='my-5'
        onClick={SaveUserAnswer}
      >
        {isRecording ? (
          <h2 className='text-red-600 flex gap-2 animate-pulse'>
            <Mic /> Recording...
          </h2>
        ) : (
          'Record Answer'
        )}
      </Button>
    </div>
  );
}

export default RecordAnswerSection;
