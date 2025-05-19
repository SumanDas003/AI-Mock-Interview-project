'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import QuestionSection from './_components/QuestionSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';

function StartInterview() {
  const { interviewId } = useParams();
  const router = useRouter(); 
  const [interviewDetails, setInterviewDetails] = useState(null);
  const [mockInterviewQuestion, setmockInterviewQuestion] = useState();
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    if (interviewId) {
      GetInterviewDetails();
    }
  }, [interviewId]);

  const GetInterviewDetails = async () => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, interviewId));

      console.log('DB query result:', result);

      if (!result || result.length === 0) {
        setError('No interview found for the given ID.');
        return;
      }

      const jsonMockResp = JSON.parse(result[0].jsonMockResp);
      setmockInterviewQuestion(jsonMockResp);
      console.log(jsonMockResp);
    } catch (error) {
      console.error('Error fetching interview:', error);
      setError('Failed to load interview data.');
    }
  };

  if (error) {
    return (
      <div className="text-red-500 font-semibold p-4">
        {error}
      </div>
    );
  }

  if (!mockInterviewQuestion) {
    return (
      <div className="p-4 text-gray-500">Loading interview...</div>
    );
  }

  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
        {/* Questions */}
        <QuestionSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
        />

        {/* Video/Audio recording */}
        <RecordAnswerSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          interviewID={interviewId}
        />
      </div>

      <div className='flex gap-5 justify-end mt-4'>
        {activeQuestionIndex > 0 && (
          <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}>
            Previous Question
          </Button>
        )}
        {activeQuestionIndex < mockInterviewQuestion?.questions?.length - 1 && (
          <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}>
            Next Question
          </Button>
        )}
        {mockInterviewQuestion?.questions?.length - 1 === activeQuestionIndex && (
          <Button onClick={() => router.push(`/dashboard/interview/${interviewId}/feedback`)}>
            End Interview
          </Button>
        )}
      </div>
    </div>
  );
}

export default StartInterview;
