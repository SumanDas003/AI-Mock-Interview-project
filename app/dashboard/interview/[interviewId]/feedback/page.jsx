'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

function Feedback() {
    const { interviewId } = useParams();
    const [feedbackData, setFeedbackData] = useState([]);
    const [averageRating, setAverageRating] = useState(null);

    const router = useRouter();

    useEffect(() => {
        const GetFeedback = async () => {
            const result = await db
                .select()
                .from(UserAnswer)
                .where(eq(UserAnswer.mockId, interviewId))
                .orderBy(UserAnswer.id, 'asc');

            setFeedbackData(result);

            if (result.length > 0) {
                const totalRating = result.reduce((sum, item) => sum + item.rating, 0);
                const avg = totalRating / result.length;
                setAverageRating(parseFloat(avg.toFixed(1))); // Rounded to 1 decimal place
            }
        };

        if (interviewId) {
            GetFeedback();
        }
    }, [interviewId]);

    return (
        <div className='p-10'>
            <h2 className='font-bold text-3xl text-green-500'>Congratulations!</h2>
            <h2 className='text-gray-500 text-lg'>Here is your interview feedback</h2>

            {feedbackData.length === 0 ? (
                <div>
                    <h2 className='text-gray-500 text-lg'>No Interview feedback available</h2>
                </div>
            ) : (
                <>
                    {averageRating !== null && (
                        <h2 className='text-purple-500 text-lg my-5'>
                            Your overall interview rating: <strong>{averageRating}/10</strong>
                        </h2>
                    )}
                    <h2 className='text-gray-500 text-sm mb-5'>
                        Find below your interview questions with correct answers and your answers with feedback for improvement
                    </h2>

                    {feedbackData.map((item, index) => (
                        <Collapsible key={index} className='mt-7'>
                            <CollapsibleTrigger className='p-2 bg-secondary rounded-lg my-2 text-left flex justify-between w-full'>
                                {item.question}
                                <ChevronsUpDown className='ml-2 h-5 w-5 gap-7' />
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <div className='flex flex-col gap-2'>
                                    <h2 className='text-red-500 p-2 border rounded-lg'>
                                        <strong>Rating:</strong> {item.rating}/10
                                    </h2>
                                    <h2 className='p-2 border rounded-lg bg-yellow-100 text-sm text-red-500 '>
                                        <strong>Your Answer: </strong> {item.userAnswer}
                                    </h2>
                                    <h2 className='p-2 border rounded-lg bg-green-100 text-sm text-green-800 '>
                                        <strong>Correct Answer: </strong> {item.correctAnswer}
                                    </h2>
                                    <h2 className='p-2 border rounded-lg bg-blue-100 text-sm text-blue-500 '>
                                        <strong>Feedback: </strong> {item.feedback}
                                    </h2>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    ))}
                </>
            )}

            <Button className='mt-6' onClick={() => router.replace('/dashboard')}>Go Home</Button>
        </div>
    );
}

export default Feedback;
