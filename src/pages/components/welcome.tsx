import React from 'react';

//PROPS INTERFACE
interface propsType {
    step: string,
    setStep: any,
    contextId: string,
    setContextId: any
}

const WelcomePage = (props: propsType) => {
    const { step, setStep, contextId, setContextId } = props;

    return (
        <div className="max-w-md w-full" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <h1 className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text text-4xl font-bold text-center mb-4">Welcome to BrandSeed</h1>
            <p className="text-lg text-center text-gray-600 mb-8">
                Seed your startup with our AI tools. What are you waiting for? Start your journey now!
            </p>
            <button
                className="bg-purple-500 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none hover:bg-purple-600 transition-colors duration-300 "
                style={{
                    width: "200px"
                }}
                onClick={() => {
                    setStep('1');
                }}
            >
                Start your journey now
            </button>
            <button  onClick={() => {
                setStep("5")
            }}>Demo</button>
        </div>
    );
};

export default WelcomePage;
