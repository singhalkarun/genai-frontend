import { error } from 'console';
import React, { useEffect, useState } from 'react';

interface PropsType {
    step: string;
    setStep: any;
    contextId: string;
    setContextId: any;
}

const CompanyNameGenPage = (props: PropsType) => {
    const { step, setStep, contextId, setContextId } = props;
    // const companyName = localStorage.getItem("companyName")
    const companyName = "Mera Company"
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [inputText, setInputText] = useState<string>('');
    const [error, setError] = useState<string>('')

    const companyNameQuestions = [
        "Which industry you're serving for?",
        "What is the USP of your product?",
        "Who is your target audience ?",
        "Tone for name like creative, unique etc.?",
        "Length of company name?",
        "Number of company names?"
    ]

    const [companyNameQuestionsObj, setCompanyNameQuestionsObj] = useState<any>([])

    const handleNextQuestion = () => {
        if (inputText === '') {
            setError("Please provide answer for this question.")
            return
        }
        else {
            setError('')
        }
        setInputText(companyNameQuestionsObj[currentQuestionIndex + 1]?.answer)
        setCurrentQuestionIndex(currentQuestionIndex + 1)
    }

    const handlePrevQuestion = () => {
        if (inputText === '') {
            setError("Please provide answer for this question.")
            return
        }
        else {
            setError('')
        }
        setInputText(companyNameQuestionsObj[currentQuestionIndex - 1]?.answer)
        setCurrentQuestionIndex(currentQuestionIndex - 1)
    }

    const handleGenerate = () => {
        setStep('2')

        //GENERATING PROMPT BASED ON QUESTION ANSWER ARRAY OF OBJECTS
        let prompt = `output format: output format: separate each word with a comma and no bullet points`
        for (let i = 0; i < companyNameQuestionsObj.length; i++) {
            prompt += ", " + companyNameQuestionsObj[i]?.question + ": " + companyNameQuestionsObj[i]?.answer
        }

        console.log("PROMPT >>", prompt)
    }

    useEffect(() => {
        const questionsMap = companyNameQuestions.map((question) => {
            return {
                question,
                answer: ""
            };
        });
        setCompanyNameQuestionsObj(questionsMap)
    }, [])

    return (
        <div className="max-w-md w-full" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <h1 className="text-4xl font-bold text-center mb-4">
                Generate name for your company!
            </h1>
            <div className="w-full px-4 md:max-w-2xl md:my-12">
                <label className="text-lg font-bold mb-4" htmlFor="context">
                    {companyNameQuestionsObj[currentQuestionIndex]?.question}
                </label>
                <input
                    type="text"
                    placeholder="Please write your answer here..."
                    className={`border ${error ? 'border-red-500' : 'border-gray-400'} w-full p-4 border-2 border-black rounded-lg resize-none`}
                    value={inputText}
                    onChange={(e) => {
                        setInputText(e.target.value)
                        let updatedCompanyNameQuestionsObj = companyNameQuestionsObj
                        updatedCompanyNameQuestionsObj[currentQuestionIndex].answer = e.target.value
                        setCompanyNameQuestionsObj(updatedCompanyNameQuestionsObj)
                    }}
                />
                {error && (
                    <p className="text-red-500 mt-2">{error}</p>
                )}
                {/* PREVIOUS QUESTION BUTTON */}
                {currentQuestionIndex > 0 ?
                    (
                        <button
                            className="bg-purple-500 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none hover:bg-purple-600 transition-colors duration-300 mt-2"
                            onClick={handlePrevQuestion}
                        >
                            Prev
                        </button>
                    ) : ''}
                {/* NEXT QUESTION BUTTON */}
                {currentQuestionIndex < (companyNameQuestions?.length - 1) ?
                    (
                        <button
                            className="bg-purple-500 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none hover:bg-purple-600 transition-colors duration-300 mt-2"
                            style={{ marginLeft: currentQuestionIndex === 0 ? "350px" : "285px" }}
                            onClick={handleNextQuestion}
                        >
                            Next
                        </button>
                    ) : ''}
                {/* FINAL SUBMIT BUTTON */}
                {
                    currentQuestionIndex === (companyNameQuestions?.length - 1) ?
                        (
                            <button
                                className="bg-purple-500 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none hover:bg-purple-600 transition-colors duration-300 mt-2"
                                style={{ marginLeft: "254px" }}
                                onClick={handleGenerate}
                            >
                                Generate
                            </button>
                        ) : ''
                }
            </div>
        </div >
    );
};

export default CompanyNameGenPage;
