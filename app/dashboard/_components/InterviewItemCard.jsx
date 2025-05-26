'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

function InterviewItemCard({ interview }) {
  const router = useRouter();

  return (
    <div className='p-5 border rounded-lg shadow-lg'>
      <h2 className='font-bold text-purple-500'>{interview.jobPosition}</h2>
      <h2 className='text-gray-600 text-sm'>{interview.jobExperience} years of experience</h2>
      <h2 className='text-gray-400 text-xs'>Created At: {interview.createdAt}</h2>
      <div className='flex justify-end mt-2'>
        <Button
          size="sm"
          className='bg-green-500 w-24 cursor-pointer'
          onClick={() => router.push(`/dashboard/interview/${interview.mockId}/feedback`)}
        >
          Feedback
        </Button>
      </div>
    </div>
  );
}

export default InterviewItemCard;
