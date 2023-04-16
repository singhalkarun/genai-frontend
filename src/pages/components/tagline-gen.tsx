import React, { useEffect, useState } from 'react';
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

const TaglineGenPage = (props: PropsType) => {
    const { step, setStep, contextId, setContextId } = props;
    const companyName = typeof window !== 'undefined' ? localStorage?.getItem("companyName") : ""
    const [subPage, setSubPage] = useState<string>('generation') //generation - Generate page, selection - Selection page
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [selectedCompanyTagline, setSelectedCompanyTagline] = useState<string>('');
    const [inputText, setInputText] = useState<string>('');
    const [inputError, setInputError] = useState<string>('')
    const [taglineQuestionsObj, setTaglineQuestionsObj] = useState<any>([])

    const taglineQuestions = [
        "What problem does your startup solve?",
        "What's the one thing you want people to remember about your startup?",
        "Additional information?"
    ]

    const [postQuestion, { data, error, loading }] = useMutation(INSERT_CONVERSATION_MUTATION)
    const subscriptionResult = useSubscription(
        CONVERSATION_SUBSCRIPTION,
        { variables: { id: contextId } }
    );

    const handleNextQuestion = () => {
        if (inputText === '') {
            setInputError("Please provide answer for this question.")
            return
        }
        else {
            setInputError('')
        }
        setInputText(taglineQuestionsObj[currentQuestionIndex + 1]?.answer)
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
        setInputText(taglineQuestionsObj[currentQuestionIndex - 1]?.answer)
        setCurrentQuestionIndex(currentQuestionIndex - 1)
    }

    const handleGenerate = async () => {
        setSubPage("selection")
        //GENERATING PROMPT BASED ON QUESTION ANSWER ARRAY OF OBJECTS
        let prompt = `1. Write company taglines based on below data - company name: ${companyName}, output format: separate each tagline with a comma and no bullet points and don't write extra text before or after results, Number of taglines?: 5`
        const example_output_format = "company tagline1, company tagline2, company tagline3"
        for (let i = 0; i < taglineQuestionsObj.length; i++) {
            prompt += ", " + taglineQuestionsObj[i]?.question + ": " + taglineQuestionsObj[i]?.answer
        }
        prompt += `2. see this example of output format: ${example_output_format}`
        const body: any = { variables: { question: prompt } }
        if (contextId) body.variables["conversation_id"] = contextId
        try {
            const response = await postQuestion(body)
            setContextId(response?.data?.insert_conversations_one?.id)
            localStorage?.setItem("contextId", response?.data?.insert_conversations_one?.id)
        } catch (error) {
            console.log("ERROR >>", JSON.stringify(error))
        }
    }

    const handleRetry = async () => {
        //PROMPT BASED ON PREVIOUS CONTEXT
        setSelectedCompanyTagline("")
        let prompt = 'Generate more company talines based on same context.'
        try {
            const response = await postQuestion({ variables: { question: prompt, conversation_id: contextId } })
            setContextId(response?.data?.insert_conversations_one?.id)
            localStorage?.setItem("contextId", response?.data?.insert_conversations_one?.id)
        } catch (error) {
            console.log("ERROR >>", JSON.stringify(error))
        }
    }

    const handleSubmit = () => {
        localStorage?.setItem('tagLine', selectedCompanyTagline)
        setStep('3')
    }

    useEffect(() => {
        const questionsMap = taglineQuestions.map((question) => {
            return {
                question,
                answer: ""
            };
        });
        setTaglineQuestionsObj(questionsMap)
    }, [])

    return (
        <div className="max-w-md w-full" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            {
                subPage === 'generation' ? (
                    <>
                        <h1 className="text-4xl font-bold text-center mb-4">
                            Generate tagline for your company name!
                        </h1>
                        <div className="w-full px-4 md:max-w-2xl md:my-12">
                            <div className="flex flex-col mb-4">
                                <label htmlFor="readonly-input" className="text-lg font-bold mb-4">
                                    Company name:
                                </label>
                                <input
                                    id="readonly-input"
                                    type="text"
                                    value={companyName || ''}
                                    readOnly
                                    className="bg-gray-200 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                />
                            </div>
                            <label className="text-lg font-bold mb-4" htmlFor="context">
                                {taglineQuestionsObj[currentQuestionIndex]?.question}
                            </label>
                            <input
                                type="text"
                                placeholder="Please write your answer here..."
                                className={`border ${inputError ? 'border-red-500' : 'border-gray-400'} w-full p-4 mb-8 border-2 border-black rounded-lg resize-none`}
                                value={inputText}
                                onChange={(e) => {
                                    setInputText(e.target.value)
                                    let updatedTaglineQuestionObj = taglineQuestionsObj
                                    updatedTaglineQuestionObj[currentQuestionIndex].answer = e.target.value
                                    setTaglineQuestionsObj(updatedTaglineQuestionObj)
                                }}
                            />
                            {inputError && (
                                <p className="text-red-500 mt-2">{inputError}</p>
                            )}
                            {/* PREVIOUS QUESTION BUTTON */}
                            {currentQuestionIndex > 0 ?
                                (
                                    <button
                                        className="bg-purple-500 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none hover:bg-purple-600 transition-colors duration-300"
                                        onClick={handlePrevQuestion}
                                    >
                                        Prev
                                    </button>
                                ) : ''}
                            {/* NEXT QUESTION BUTTON */}
                            {currentQuestionIndex < (taglineQuestions?.length - 1) ?
                                (
                                    <button
                                        className="bg-purple-500 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none hover:bg-purple-600 transition-colors duration-300"
                                        style={{ marginLeft: currentQuestionIndex === 0 ? "350px" : "285px" }}
                                        onClick={handleNextQuestion}
                                    >
                                        Next
                                    </button>
                                ) : ''}
                            {/* FINAL SUBMIT BUTTON */}
                            {
                                currentQuestionIndex === (taglineQuestions?.length - 1) ?
                                    (
                                        <button
                                            className="bg-purple-500 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none hover:bg-purple-600 transition-colors duration-300"
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
                    subPage === 'selection' ? (
                        <>
                            <h1 className="text-4xl font-bold text-center mb-4" style={{
                                marginTop: subscriptionResult?.data?.conversations_by_pk?.answer ? "60px" : "0px"
                            }}>
                                Choose any, and if you don't love it, simply hit retry.
                            </h1>
                            {subscriptionResult?.loading != undefined && (subscriptionResult?.loading == true || (subscriptionResult?.data != undefined && subscriptionResult?.data?.conversations_by_pk?.answer == null)) && <TypingAnimation />}

                            {subscriptionResult?.loading != undefined && subscriptionResult?.loading != true && subscriptionResult?.data != undefined && subscriptionResult?.data?.conversations_by_pk?.answer != null && <div className="grid grid-cols-1 gap-4" style={{
                                width: "100%"
                            }}>
                                {subscriptionResult?.data?.conversations_by_pk?.answer && subscriptionResult?.data?.conversations_by_pk?.answer?.split(",")?.map((name: string) => (
                                    <div
                                        className={`${selectedCompanyTagline === name ? "bg-purple-500" : "bg-white"} rounded-lg shadow-lg p-4 cursor-pointer`}
                                        onClick={() => {
                                            setSelectedCompanyTagline(name)
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
                                {selectedCompanyTagline ?
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

export default TaglineGenPage;
