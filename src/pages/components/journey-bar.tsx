import Link from 'next/link';
import { useRouter } from 'next/router';

interface PropsType {
    step: string;
    setStep: any;
    contextId: string;
    setContextId: any;
}

const JourneyBar = (props: PropsType) => {
    const { step, setStep, contextId, setContextId } = props;
    const activeLink = (currentStep: string) => {
        return step === currentStep ? 'bg-gray-900 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white';
    };

    const journey = [
        { title: 'Create company name', step: "1" },
        { title: 'Create tagline', step: "2" },
        { title: 'Create company logo', step: "3" },
    ];

    return (
        <div className="bg-gray-800 text-gray-100 w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out h-screen">
            {journey.map((item) => (
                <div className="flex items-center space-x-2 block py-2 px-4 bg-gray-900">
                    {parseInt(item?.step) < parseInt(step) ?
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M19.707,2.293c-0.391-0.391-1.023-0.391-1.414,0l-12,12c-0.391,0.391-1.023,0.391-1.414,0l-5-5c-0.391-0.391-0.391-1.023,0-1.414l1.414-1.414c0.391-0.391,1.023-0.391,1.414,0l3.293,3.293l10.293-10.293c0.391-0.391,1.023-0.391,1.414,0l1.414,1.414C20.098,1.27,20.098,1.902,19.707,2.293z" clipRule="evenodd" />
                        </svg> : ''}
                    <span className={`${activeLink(item?.step)}`}>
                        {item.title}
                    </span>
                </div>
            ))}
        </div>


    );
};

export default JourneyBar;
