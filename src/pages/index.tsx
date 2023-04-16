import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import WelcomePage from "./components/welcome";
import CompanyNameGenPage from "./components/company-name-gen";
import TaglineGenPage from "./components/tagline-gen";
import LogoGenPage from "./components/logo-gen";
import Demo from "./components/demo";
import Playground from "./components/playground";
import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import JourneyBar from "./components/journey-bar";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import getClient from "./api/apollo";
import Head from 'next/head';

const inter = Inter({ subsets: ["latin"] });
interface ChatMessage {
  type: string;
  message: string;
}

interface HomeProps {
  hasuraBaseUrl: string
  hasuraAdminSecret: string
}

export default function Home({ hasuraBaseUrl, hasuraAdminSecret }: HomeProps) {
  const [step, setStep] = useState<string>("0");
  const [contextId, setContextId] = useState<string>("");


  //On page refresh getting step and contextId from local storage
  useEffect(() => {
    const step = localStorage?.getItem('step');
    const contextId = localStorage?.getItem('contextId')
    if (step) setStep(step)
    if (contextId) setContextId(contextId)
  }, [])

  const router = useRouter()
  if (!router.isFallback && !hasuraAdminSecret && !hasuraBaseUrl) {
    return <ErrorPage statusCode={404} />
  }

  return (
    <>
      <Head>
        <title>BrandSeed</title>
        <script src="https://cdn.jsdelivr.net/npm/@lottiefiles/lottie-player@latest"></script>
      </Head>
      {/* NAVBAR */}
      <div className="bg-gray-800 py-2 fixed top-0 w-full z-10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex-shrink-0">
            <p className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text text-3xl font-bold text-center" style={{
              marginLeft: "-50px"
            }}>BrandSeed</p>
          </div>

          <div className="hidden sm:flex sm:items-center ml-auto">
            <p className="text-gray-100 hover:text-gray-500 text-base px-3 py-2 rounded-md font-medium">{`Feeling stuck? Let's hit the restart button and start fresh!`}</p>
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

export async function getStaticProps() {
  const hasuraBaseUrl = process.env.HASURA_BASE_URL!
  const hasuraAdminSecret = process.env.HASURA_ADMIN_SECRET!

  return {
    props: {
      hasuraBaseUrl,
      hasuraAdminSecret
    }
  }
}
