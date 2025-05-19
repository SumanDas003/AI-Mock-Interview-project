"use client"
import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { desc } from 'drizzle-orm'
import InterviewItemCard from './InterviewItemCard'

function InterviewList() {
    const { user } = useUser();
    const [interviewList, setInterviewList] = useState([]);
    const GetInterviewList = async () => {
        const result = await db
            .select()
            .from(MockInterview)
            .where(eq(MockInterview.createdBy, user.primaryEmailAddress.emailAddress)).orderBy(desc(MockInterview.id));
        setInterviewList(result);
        console.log(result);
    }
    useEffect(() => {
        GetInterviewList();
    }, [user]);
  return (
    <div>
        <h2 className='font-medium text-xl'>Previous Mock Interviews</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3'>
            {interviewList.map((interview,index) => (
            <InterviewItemCard 
            interview={interview}
            key={index}/>
            ))}
        </div>
    </div>
  )
}

export default InterviewList