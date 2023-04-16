import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { gql, useSubscription } from "@apollo/client";
import { useMutation } from "@apollo/client";
import TypingAnimation from './TypingAnimation';

const INSERT_CONVERSATION_MUTATION = gql`
  mutation PostQuestion($question: String ) {
    insert_conversations_one(
      object: { question: $question }
    ) {
      id
      conversation_id
      question
    }
  }
`;

const CONVERSATION_SUBSCRIPTION = gql`
  subscription ConversationSubscription ($id: Int!) {
    conversations_by_pk(id: $id) {
      id
      answer
    }
  }
    `;

interface PropsType {
    step: string;
    setStep: any;
    contextId: string;
    setContextId: any;
}

const CompanyNameGenPage = (props: PropsType) => {
    const { step, setStep, contextId, setContextId } = props;
    const [id, setId] = useState<string>("");
    const [subPage, setSubPage] = useState<string>('generation') //generation - Generate page, selection - Selection page
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [inputText, setInputText] = useState<string>('');
    const [inputError, setInputError] = useState<string>('')
    const [selectedCompanyName, setSelectedCompanyName] = useState<string>('')
    const [companyNameQuestionsObj, setCompanyNameQuestionsObj] = useState<any>([])
    const [selectedOption, setSelectedOption] = useState(null);

    const options = [
        { value: 'Artificial Intelligence', label: 'Artificial Intelligence' },
        { value: 'Augmented Reality', label: 'Augmented Reality' },
        { value: 'Biotechnology', label: 'Biotechnology' },
        { value: 'Clean Energy', label: 'Clean Energy' },
        { value: 'Cloud Computing', label: 'Cloud Computing' },
        { value: 'Cybersecurity', label: 'Cybersecurity' },
        { value: 'E-commerce', label: 'E-commerce' },
        { value: 'Edtech', label: 'Edtech' },
        { value: 'Fintech', label: 'Fintech' },
        { value: 'Healthtech', label: 'Healthtech' },
        { value: 'Internet of Things (IoT)', label: 'Internet of Things (IoT)' },
    ];

    const [postQuestion, { data, error, loading }] = useMutation(INSERT_CONVERSATION_MUTATION)
    const subscriptionResult = useSubscription(
        CONVERSATION_SUBSCRIPTION,
        { variables: { id: contextId } }
    );

    const companyNameQuestions = [
        "Which industry you're serving for?",
        "What is the USP of your product?",
        "Who is your target audience ?",
        "Tone for name like creative, unique etc.?",
        "Length of company name?"
    ]

    const handleNextQuestion = () => {
        if (inputText === '') {
            setInputError("Please provide answer for this question.")
            return
        }
        else {
            setInputError('')
        }
        setInputText(companyNameQuestionsObj[currentQuestionIndex + 1]?.answer)
        setCurrentQuestionIndex(currentQuestionIndex + 1)
    }

    const handlePrevQuestion = () => {
        if (inputText === '') {
            setInputError("Please provide answer for this question.")
            return
        }
        else {
            setInputError('')
        }
        setInputText(companyNameQuestionsObj[currentQuestionIndex - 1]?.answer)
        setCurrentQuestionIndex(currentQuestionIndex - 1)
    }

    const handleGenerate = async () => {
        setSubPage("selection")
        //GENERATING PROMPT BASED ON QUESTION ANSWER ARRAY OF OBJECTS
        let prompt = `Please write company names based on information below and please follow output format - output format: separate each word with a comma and no bullet points and don't write extra text before or after results, Number of company names?: 5`
        for (let i = 0; i < companyNameQuestionsObj.length; i++) {
            prompt += ", " + companyNameQuestionsObj[i]?.question + ": " + companyNameQuestionsObj[i]?.answer
        }

        try {
            const response = await postQuestion({ variables: { question: prompt } })
            setContextId(response?.data?.insert_conversations_one?.id)
            localStorage?.setItem("contextId", response?.data?.insert_conversations_one?.id)
        } catch (error) {
            console.log("ERROR >>", JSON.stringify(error))
        }
        console.log("PROMPT >> ", prompt)
    }

    const handleRetry = async () => {
        //PROMPT BASED ON PREVIOUS CONTEXT
        let prompt = 'Generate more company names based on same context.'
        try {
            const response = await postQuestion({ variables: { question: prompt } })
            setContextId(response?.data?.insert_conversations_one?.id)
            localStorage?.setItem("contextId", response?.data?.insert_conversations_one?.id)
        } catch (error) {
            console.log("ERROR >>", JSON.stringify(error))
        }
        console.log("PROMPT >> ", prompt)
    }

    const handleSubmit = () => {
        localStorage.setItem('companyName', selectedCompanyName)
        setStep('2')
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
            {
                subPage == 'generation' ? (
                    <>
                        <h1 className="text-4xl font-bold text-center mb-4">
                            Generate name for your company!
                        </h1>
                        <div className="w-full px-4 md:max-w-2xl md:my-12">
                            <label className="text-lg font-bold mb-4" htmlFor="context">
                                {companyNameQuestionsObj[currentQuestionIndex]?.question}
                            </label>
                            {
                                currentQuestionIndex === 0 ? (
                                    <Select value={selectedOption} onChange={(e: any) => {
                                        setSelectedOption(e)
                                        setInputText(e.value)
                                        let updatedCompanyNameQuestionsObj = companyNameQuestionsObj
                                        updatedCompanyNameQuestionsObj[currentQuestionIndex].answer = e.value
                                        setCompanyNameQuestionsObj(updatedCompanyNameQuestionsObj)
                                    }} options={options} />
                                ) : (
                                    <>
                                        <input
                                            type="text"
                                            placeholder="Please write your answer here..."
                                            className={`border ${inputError ? 'border-red-500' : 'border-gray-400'} w-full p-4 border-2 border-black rounded-lg resize-none`}
                                            value={inputText}
                                            onChange={(e) => {
                                                setInputText(e.target.value)
                                                let updatedCompanyNameQuestionsObj = companyNameQuestionsObj
                                                updatedCompanyNameQuestionsObj[currentQuestionIndex].answer = e.target.value
                                                setCompanyNameQuestionsObj(updatedCompanyNameQuestionsObj)
                                            }}
                                        />
                                        {inputError && (
                                            <p className="text-red-500 mt-2">{inputError}</p>
                                        )}
                                    </>
                                )
                            }
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
                    </>
                ) :
                    subPage === "selection" ? (
                        <>
                            <h1 className="text-4xl font-bold text-center mb-4">
                                Choose anyone, and if you don't love it, simply hit retry.
                            </h1>
                            {subscriptionResult?.loading != undefined && subscriptionResult?.loading != true && subscriptionResult?.data != undefined && subscriptionResult?.data?.conversations_by_pk?.answer != null && <div className={`border ${error ? "border-red-500" : "border-gray-400"
                                } w-full p-4 mb-8 border-2 border-black rounded-lg resize-none`}> {subscriptionResult?.data?.conversations_by_pk?.answer}</div>}
                            {subscriptionResult?.loading != undefined && (subscriptionResult?.loading == true || (subscriptionResult?.data != undefined && subscriptionResult?.data?.conversations_by_pk?.answer == null)) && <TypingAnimation />}

                            {subscriptionResult?.loading != undefined && subscriptionResult?.loading != true && subscriptionResult?.data != undefined && subscriptionResult?.data?.conversations_by_pk?.answer != null && <div className="grid grid-cols-1 gap-4" style={{
                                width: "100%"
                            }}>
                                {subscriptionResult?.data?.conversations_by_pk?.answer && subscriptionResult?.data?.conversations_by_pk?.answer?.split(",")?.map((name: string) => (
                                    <div
                                        className={`${selectedCompanyName === name ? "bg-purple-500" : "bg-white"} rounded-lg shadow-lg p-4 cursor-pointer`}
                                        onClick={() => {
                                            setSelectedCompanyName(name)
                                        }}
                                    >
                                        <h2 className="text-lg font-medium">{name}</h2>
                                    </div>
                                ))}
                            </div>}
                            <div style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                width: "100%"
                            }}>
                                {/* RETRY BUTTON */}
                                {subscriptionResult?.data?.conversations_by_pk?.answer ?
                                    (
                                        <button
                                            className="bg-purple-500 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none hover:bg-purple-600 transition-colors duration-300 mt-2"
                                            onClick={handleRetry}
                                        >
                                            Retry
                                        </button>
                                    ) : ''}
                                {/* SUBMIT BUTTON */}
                                {selectedCompanyName ?
                                    (
                                        <button
                                            className="bg-purple-500 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none hover:bg-purple-600 transition-colors duration-300 mt-2"
                                            onClick={handleSubmit}
                                        >
                                            Submit
                                        </button>
                                    ) : ''}
                            </div>
                        </>
                    ) : ""
            }
        </div >
    );
};

export default CompanyNameGenPage;
