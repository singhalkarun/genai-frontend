import Link from "next/link";
import { useRouter } from "next/router";

interface PropsType {
    step: string;
    setStep: any;
    contextId: string;
    setContextId: any;
}

const JourneyBar = (props: PropsType) => {
    const { step, setStep, contextId, setContextId } = props;
    const activeLink = (currentStep: string) => {
        return step === currentStep
            ? "bg-gray-900 text-white"
            : "text-gray-400 hover:bg-gray-700 hover:text-white";
    };

    const journey = [
        { title: "Generate company name", step: "1" },
        { title: "Generate tagline", step: "2" },
        { title: "Generate company logo", step: "3" },
    ];

    return (
        <div className="bg-gray-800 text-gray-100 w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out h-screen flex flex-col" style={{
            marginTop: "55px"
        }}>
            {journey.map((item, i) => (
                <div
                    key={i}
                    className="flex items-center space-x-2 block py-2 px-4 bg-gray-900"
                >
                    {parseInt(item?.step) < parseInt(step) && step !== "5" ? (
                        <svg
                            className="w-4 h-4 text-green-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M19.707,2.293c-0.391-0.391-1.023-0.391-1.414,0l-12,12c-0.391,0.391-1.023,0.391-1.414,0l-5-5c-0.391-0.391-0.391-1.023,0-1.414l1.414-1.414c0.391-0.391,1.023-0.391,1.414,0l3.293,3.293l10.293-10.293c0.391-0.391,1.023-0.391,1.414,0l1.414,1.414C20.098,1.27,20.098,1.902,19.707,2.293z"
                                clipRule="evenodd"
                            />
                        </svg>
                    ) : (
                        ""
                    )}
                    <span
                        className={`${activeLink(item?.step)} ${step === "5" && "cursor-not-allowed"
                            }`}
                    >
                        {item.title}
                    </span>
                </div>
            ))}
            <div className="flex justify-end">
                <button
                    className="flex items-center justify-center absolute bottom-16 left-1/2 transform -translate-x-1/2 h-12 px-4 rounded-lg bg-purple-500 text-white font-bold focus:outline-none hover:bg-purple-600 transition-colors duration-300 mb-4"
                    onClick={() => {
                        setStep("5");
                    }}
                >
                    <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                    </svg>
                    Playground
                </button>
            </div>
        </div>
    );
};

export default JourneyBar;
