import React from "react";
import { useState, useEffect } from "react";

interface Question {
  id: number;
  value: string;
}

function CompanyNameGenPage() {
//   const [inputValue, setInputValue] = useState<string>("");
//   const [answers, setAnswers] = useState<string[]>([]);
//   const [currentQuestion, setCurrentQuestion] = useState<number>(0);

  const questions: Question[] = [
    { id: 1, value: "Question1" },
    { id: 2, value: "Question2" },
    { id: 3, value: "Question3" },
    { id: 4, value: "Question4" },
  ];

  

  const [answers, setAnswers] = useState<string[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);

    function handleAnswer(questionId: number, answer: string) {
        setAnswers(prevAnswers => {
            const newAnswers = [...prevAnswers];
            newAnswers[questionId - 1] = answer;
            return newAnswers;
        });
    }

    function handleSendClick() {
        setCurrentQuestion(prevQuestion => prevQuestion + 1);
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            {questions.slice(0, currentQuestion).map(q => (
                <div key={q.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div style={{ background: '#eee', padding: '10px', borderRadius: '10px', maxWidth: '60%' }}>
                        <p style={{ margin: 0 }}>{q.value}</p>
                    </div>
                    <div style={{ background: '#fff', padding: '10px', borderRadius: '10px', maxWidth: '60%', alignSelf: 'flex-end' }}>
                        <p style={{ margin: 0 }}>{answers[q.id - 1]}</p>
                    </div>
                </div>
            ))}
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center' }}>
                <input type="text" onChange={(e) => handleAnswer(questions[currentQuestion].id, e.target.value)} />
                <button onClick={handleSendClick}>Send</button>
            </div>
        </div>
    );
}

export default CompanyNameGenPage;

// import { useState } from 'react';

// interface Question {
//     id: number;
//     value: string;
// }

// const questions: Question[] = [
//     { id: 1, value: "Question1" },
//     { id: 2, value: "Question2" },
//     { id: 3, value: "Question3" },
//     { id: 4, value: "Question4" }
// ];

// function App() {
//     const [answers, setAnswers] = useState<string[]>([]);

//     function handleAnswer(questionId: number, answer: string) {
//         setAnswers(prevAnswers => {
//             const newAnswers = [...prevAnswers];
//             newAnswers[questionId - 1] = answer;
//             return newAnswers;
//         });
//     }

//     return (
       
//     );
// }
