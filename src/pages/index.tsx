import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import WelcomePage from "./components/welcome";
import CompanyNameGenPage from "./components/company-name-gen";
import TaglineGenPage from "./components/tagline-gen";
import LogoGenPage from "./components/logo-gen";
import JourneyBar from "./components/journey-bar";

const inter = Inter({ subsets: ["latin"] });
interface ChatMessage {
  type: string;
  message: string;
}

export default function Home() {
  const [inputValue, setInputValue] = useState<string>("");
  const [step, setStep] = useState<string>("0");
  const [contextId, setContextId] = useState<string>("");
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
      "https://9fso8yscb5.execute-api.ap-south-1.amazonaws.com/default/fetchAnswerFromChatGPT";

    const headers = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"

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

  //On page refresh getting step and contextId from local storage
  useEffect(() => {
    const step = localStorage.getItem('step');
    const contextId = localStorage.getItem('contextId')
    if (step) setStep(step)
    if (contextId) setContextId(contextId)
  }, [])

  return (
    <>
      <div style={{ display: "flex", flexDirection: "row", height: "auto" }}>
        <div>
          <JourneyBar step={step} setStep={setStep} contextId={contextId} setContextId={setContextId} />
        </div>
        <div className="container mx-auto px-4 h-screen flex justify-center items-center bg-gray-100">
          {step === "0" ? <WelcomePage step={step} setStep={setStep} contextId={contextId} setContextId={setContextId} /> :
            step === "1" ? <CompanyNameGenPage step={step} setStep={setStep} contextId={contextId} setContextId={setContextId} /> :
              step === "2" ? <TaglineGenPage step={step} setStep={setStep} contextId={contextId} setContextId={setContextId} /> :
                step === "3" ? <LogoGenPage /> : ""}
        </div>
      </div>

      {/* <h1 className="text-3xl font-bold ">GEN-AI</h1>

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
      </form> */}
    </>
  );
}
