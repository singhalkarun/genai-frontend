import Image from "next/image";
import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import axios from 'axios'
import { createProxyMiddleware } from 'http-proxy-middleware';


const inter = Inter({ subsets: ["latin"] });
interface ChatMessage {
  type: string;
  message: string;
}

export default function Home() {
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

  
  const sendMessage = async  (message: string) => {
    const url =
      "https://9fso8yscb5.execute-api.ap-south-1.amazonaws.com/default/fetchAnswerFromChatGPT";
      
    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept"
      
    }
 
    let body = {
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    };
    console.log(url, "GGGGGGG", JSON.stringify(body));
    let response = {
      role: "assistant",
      content: "Hello! How can I assist you today?",
    };
    //  let response = await axios.post(url, body, {headers: headers})
     console.log(response, 'GG')
    

    setChatLog((prevChatLog) => [...prevChatLog, { type: response?.role, message: response?.content }])
  };

  return (
    <>
      <h1 className="text-3xl font-bold ">GEN-AI</h1>

      {chatLog.map((message, index) => (
        <div key="index">{message.message}</div>
      ))}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </>
  );
}
