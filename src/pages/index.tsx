import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import WelcomePage from "./components/welcome";
import CompanyNameGenPage from "./components/company-name-gen";
import TaglineGenPage from "./components/tagline-gen";
import LogoGenPage from "./components/logo-gen";
import Demo from "./components/demo";
import Playground from "./components/playground";



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
      {/* NAVBAR */}
      <div className="bg-gray-800 py-2">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex-shrink-0">
            <p className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text text-3xl font-bold text-center" style={{
              marginLeft: "-50px"
            }}>BrandSeed</p>
          </div>
          <div className="hidden sm:flex sm:items-center sm:ml-6">
            <p className="text-gray-100 hover:text-gray-500 text-base px-3 py-2 rounded-md font-medium">Check the playground!</p>
            <button
              className="ml-4 bg-purple-500 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none hover:bg-purple-600 transition-colors duration-300 "
              style={{
                width: "110px"
              }}
              onClick={() => {
                setStep('5');
              }}
            >
              Playground
            </button>
          </div>
          <div className="hidden sm:flex sm:items-center sm:ml-6">
            <p className="text-gray-100 hover:text-gray-500 text-base px-3 py-2 rounded-md font-medium">Feeling stuck? Let's hit the restart button and start fresh!</p>
            <button
              className="ml-4 bg-purple-500 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none hover:bg-purple-600 transition-colors duration-300 "
              style={{
                width: "180px"
              }}
              onClick={() => {
                setStep('0');
              }}
            >
              Restart your journey
            </button>
          </div>
        </nav>
      </div>
      <div style={{ display: "flex", flexDirection: "row", height: "auto" }}>
        {/* JOURNEYBAR */}
        <div>
          <JourneyBar step={step} setStep={setStep} contextId={contextId} setContextId={setContextId} />
        </div>
        {/* ROUTING BASED ON STEP */}
        <div className="container mx-auto px-4 h-screen flex justify-center items-center bg-gray-100">
          {step === "0" ? <WelcomePage step={step} setStep={setStep} contextId={contextId} setContextId={setContextId} /> :
            step === "1" ? <CompanyNameGenPage step={step} setStep={setStep} contextId={contextId} setContextId={setContextId} /> :
              step === "2" ? <TaglineGenPage step={step} setStep={setStep} contextId={contextId} setContextId={setContextId} /> :
                step === "3" ? <LogoGenPage /> :
                  step === "4" ? <Demo /> :
                    step === "5" ? <Playground /> : ""}
        </div>
      </div>
    </>
  );
}
