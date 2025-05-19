"use client"
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import Webcam from 'react-webcam';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function Interview() {
  const { interviewId } = useParams();
  const [interviewDetails, setInterviewDetails] = useState(null);
  const [webCamEnabled, setWebCamEnabled] = useState(false);

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
      console.log(result);
      setInterviewDetails(result[0]);
    } catch (error) {
      console.error('Error fetching interview:', error);
    }
  };

  return (
    <div className='my-10 flex items-center justify-center flex-col'>
      <h2 className='font-bold text-2xl'>Let's Get Started</h2>
      <div className='grid grid-cols-2 gap-10'>

        <div className='flex flex-col my-5 gap-5 p-5 rounded-lg border'>
          <div className='flex flex-col gap-5  p-5 rounded-lg border'>
            <h2><strong>Job Role/Job Position:</strong>{interviewDetails?.jobPosition}</h2>
            <h2><strong>Job Description:</strong>{interviewDetails?.jobDesc}</h2>
            <h2><strong>Years of Experience:</strong>{interviewDetails?.jobExperience}</h2>
          </div>
          <div className='p-5 rounded-lg border border-yellow-300 bg-yellow-100'>
            <h2 className='flex items-center gap-2 text-yellow-500'><Lightbulb /><strong>Information</strong></h2>
            <h2 className='mt-3 text-green-500'>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
          </div>
        </div>

        <div className='flex flex-col items-center gap-4'>
          {webCamEnabled ? (
            <Webcam
              onUserMedia={() => setWebCamEnabled(true)}
              onUserMediaError={(err) => {
                console.error('Webcam error:', err);
                setWebCamEnabled(false);
              }}
              mirrored={true}
              style={{ width: '100%', height: '100%' }}
            />
          ) : (
            <WebcamIcon className='w-full h-72 p-20 my-10 bg-secondary rounded-lg border' />
          )}
          <Button onClick={() => setWebCamEnabled((prev) => !prev)} >
            {webCamEnabled ? 'Disable Webcam' : 'Enable Webcam and Microphone'}
          </Button>
        </div>

      </div>
      <Link href={`/dashboard/interview/${interviewId}/start`}>
        <Button className='bg-purple-500'>Start Interview</Button>
      </Link>
    </div>
  )
}

export default Interview;

