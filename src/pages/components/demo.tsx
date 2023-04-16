import Image from "next/image";
import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import axios from "axios";
import TypingAnimation from "./TypingAnimation";

const inter = Inter({ subsets: ["latin"] });
interface ChatMessage {
  type: string;
  message: string;
}

export default function Demo() {
  const [inputValue, setInputValue] = useState<string>("");
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setChatLog((prevChatLog) => [
      ...prevChatLog,
      { type: "user", message: inputValue },
    ]);

    sendMessage(inputValue);

    setInputValue("");
  };

  const sendMessage = async (message: string) => {
    const url =
      "https://79lm3hpao7.execute-api.ap-south-1.amazonaws.com/default/fetchAnswerFromChatGPT";

    const headers = {
      "Content-Type": "application/json",
    };

    let body = {
      question: message,
    };
    setIsLoading(true);
    axios
      .post(url, body)
      .then((response) => {
        console.log(JSON.stringify(response), "RESPONSE");
        setChatLog((prevChatLog) => [
          ...prevChatLog,
          { type: "bot", message: response?.data?.answer },
        ]);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
      });
  };

  return (
    <div className="container mx-auto max-w-[700px]">
      {/* <div className="flex flex-col h-screen bg-gray-900"> */}
      <div className="flex flex-col h-screen ">
        <h1 className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text text-center py-3 font-bold text-6xl">GEN-AI</h1>
        <div className="flex-grow p-6">
          <div className="flex flex-col space-y-4">
          {
        chatLog.map((message, index) => (
          <div key={index} className={`flex ${
            message.type === 'user' ? 'justify-end' : 'justify-start'
            }`}>
            <div className={`${
              message.type === 'user' ? 'bg-purple-500' : 'bg-gray-800'
            } rounded-lg p-4 text-white max-w-sm`}>
            {message.message}
            </div>
            </div>
        ))
            }
            {
              isLoading &&
              <div key={chatLog.length} className="flex justify-start">
                <TypingAnimation />
                  {/* <div className="bg-gray-700 rounded-lg p-4 text-white max-w-sm">
                    <TypingAnimation />
                  </div> */}
              </div>
            }
      </div>
        </div>
        <form onSubmit={handleSubmit} className="flex-none p-6">
          <div className="flex rounded-lg border border-gray-700 bg-gray-800">  
        <input type="text" className="flex-grow px-4 py-2 bg-transparent text-white focus:outline-none" placeholder="Type your message..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
            <button type="submit" className="bg-purple-500 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none hover:bg-purple-600 transition-colors duration-300">Send</button>
            </div>
        </form>
        </div>
    </div>
  )
}
