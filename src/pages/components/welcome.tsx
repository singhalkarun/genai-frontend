import React from 'react';

interface propsType {
    step: string,
    setStep: any,
    contextId: string,
    setContextId: any
}

//STYLES
const containerStyle: any = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#F8F8F8'
};

const titleStyle: any = {
    fontSize: '3rem',
    marginBottom: '1rem',
    textAlign: 'center',
    color: '#333'
};

const descriptionStyle: any = {
    fontSize: '1.5rem',
    marginBottom: '2rem',
    textAlign: 'center',
    color: '#555'
};

const buttonStyle: any = {
    padding: '1rem 2rem',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#FFF',
    backgroundColor: '#0070F3',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer'
};

const WelcomePage = (props: propsType) => {

    const { step, setStep, contextId, setContextId } = props

    return (
        <div style={containerStyle}>
            <h1 style={titleStyle}>Welcome to My Website</h1>
            <p style={descriptionStyle}>We are glad to have you here. Start your journey now!</p>
            <button style={buttonStyle} onClick={() => {
                setStep("1")
            }}>Start your journey now</button>
            <button style={buttonStyle} onClick={() => {
                setStep("5")
            }}>Demo</button>
        </div>
    );
};

export default WelcomePage;
