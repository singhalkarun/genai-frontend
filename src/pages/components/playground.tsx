import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import { gql, useSubscription } from "@apollo/client";
import { useMutation } from "@apollo/client";
import TypingAnimation from "./TypingAnimation";

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

export default function Playground() {
  const [inputValue, setInputValue] = useState<string>("");
  const [id, setId] = useState<string>("");



  const [postQuestion, { data, error, loading }] = useMutation(INSERT_CONVERSATION_MUTATION)

    const subscriptionResult = useSubscription(
      CONVERSATION_SUBSCRIPTION,
      { variables: { id: id } }
    );

    console.log(subscriptionResult)
  
  
  if (loading) return <h1>Submitting...</h1>;
  if (error) return <h1>{`Submission error! ${error.message}`}</h1>;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await postQuestion({ variables: { question: inputValue } })

      setId(response?.data?.insert_conversations_one?.id)
    } catch (error) {
      
    }
  };


  return (
    <form onSubmit={handleSubmit} className="flex-none p-6">
      <div className="w-full px-4 md:max-w-2xl md:my-12 flex">
        <textarea
          placeholder="Please write your question here..."
          className={`border ${
            error ? "border-red-500" : "border-gray-400"
          } flex-grow p-4 mb-8 border-2 border-black rounded-lg resize-none h-full`}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
        />
        <button
          type="submit"
          className="bg-purple-500 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none hover:bg-purple-600 transition-colors duration-300 ml-2 h-full"
        >
          Send
        </button>
      </div>
      {subscriptionResult?.loading != undefined && (subscriptionResult?.loading == true || (subscriptionResult?.data != undefined && subscriptionResult?.data?.conversations_by_pk?.answer == null)) && <TypingAnimation />}
      {subscriptionResult?.loading != undefined && subscriptionResult?.loading != true && subscriptionResult?.data != undefined && subscriptionResult?.data?.conversations_by_pk?.answer != null && <div className={`border ${
        error ? "border-red-500" : "border-gray-400"
      } w-full p-4 mb-8 border-2 border-black rounded-lg resize-none`}> {subscriptionResult?.data?.conversations_by_pk?.answer}</div>}
    </form>
  );
  
}
