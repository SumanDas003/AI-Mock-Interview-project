import React from 'react';
import { Lightbulb, Volume2 } from 'lucide-react';


function QuestionSection({ mockInterviewQuestion, activeQuestionIndex }) {

  const textToSpeach = (text) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else  {
      alert("Your browser does not support text to speech");
    }
  }
  // Return early if questions are not loaded or malformed
  if (!mockInterviewQuestion || !Array.isArray(mockInterviewQuestion.questions)) {
    return <p>Loading questions...</p>;
  }

  return (
    <div className='p-5 border rounded-lg my-10'>
      {/* Question navigation buttons */}
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
        {mockInterviewQuestion.questions.map((question, index) => (
          <h2
            key={index}
            className={`p-2 rounded-full text-xs md:text-sm text-center cursor-pointer ${
              index === activeQuestionIndex
                ? 'bg-purple-500 text-white'
                : 'bg-secondary'
            }`}
          >
            Question #{index + 1}
          </h2>
        ))}
      </div>

      {/* Active question display */}
      <h2 className='mt-5 text-lg font-semibold'>
        {mockInterviewQuestion.questions[activeQuestionIndex]}
      </h2>
      <Volume2 className='cursor-pointer mt-2 text-yellow-500' onClick={() => textToSpeach(mockInterviewQuestion.questions[activeQuestionIndex]) }/>
      
      <div className='border rounded-lg p-5 bg-blue-100 mt-20'>
        <h2 className='flex items-center gap-2 text-blue-700'>
          <Lightbulb />
          <strong>Note: </strong>
        </h2>
        <h2 className='text-sm text-purple-900 my-2'>{process.env.NEXT_PUBLIC_QUESTION_NOTE}</h2>
      </div>
    </div>
  );
}

export default QuestionSection;
