import Image from "next/image";
import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import axios from "axios";
import TypingAnimation from "./TypingAnimation";
import { gql, useQuery } from "@apollo/client";
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
  from,
} from "@apollo/client";
import { useMutation } from "@apollo/client";

const inter = Inter({ subsets: ["latin"] });
interface ChatMessage {
  type: string;
  message: string;
}

const INSERT_CONVERSATION_MUTATION = gql`
  mutation PostQuestion($question: String, $conversation_id: uuid) {
    insert_conversations_one(
      object: { question: $question, conversation_id: $conversation_id }
    ) {
      id
      conversation_id
      question
    }
  }
`;

export default function Playground() {
  const [insertConversation, { data, error, loading }] = useMutation(
    INSERT_CONVERSATION_MUTATION
  );
  if (loading) return <p>Loading...........</p>;
  if (error) return <p>Oooooooopssss.......... {error.message}</p>;
  console.log(data, "DATTTA");

  const [inputValue, setInputValue] = useState<string>("");
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [postQuestion] = useMutation(INSERT_CONVERSATION_MUTATION);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    sendMessage(inputValue);

    setInputValue("");
  };

  const sendMessage = async (message: string) => {
    setIsLoading(true);

    postQuestion({ variables: { question: message, conversation_id: '08c253f0-fd72-4a66-9d15-9eb07cdf641e' } })
      .then((response) => {
        console.log(JSON.stringify(response), "RESPONSE");

        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="flex-none p-6">
      <div className="w-full px-4 md:max-w-2xl md:my-12">
        <input
          type="text"
          placeholder="Please write your question here..."
          className={`border ${
            error ? "border-red-500" : "border-gray-400"
          } w-full p-4 mb-8 border-2 border-black rounded-lg resize-none`}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
        />
        <button
          type="submit"
          className="bg-purple-500 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none hover:bg-purple-600 transition-colors duration-300"
        >
          Send
        </button>
      </div>
    </form>
  );
}
