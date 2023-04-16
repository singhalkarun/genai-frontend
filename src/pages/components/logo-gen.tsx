import React from 'react';
import type { LottiePlayer } from 'lottie-web';

declare global {
    namespace JSX {
      interface IntrinsicElements {
        'lottie-player': React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> & {
            src: string;
            background: string;
            speed: string;
            loop?: boolean;
            autoplay?: boolean;
          },
          HTMLElement
        >;
      }
    }
  }

  
function LogoGenPage() {
    
    const loadingScreen = (
        <div id="loading-screen">
          <lottie-player
            src="https://assets9.lottiefiles.com/packages/lf20_riAqnQrYxZ.json"
            background="transparent"
            speed="0.6"
            style={{ width: "600px", height: "300px" }}
            loop
            autoplay
          ></lottie-player>
         
        </div>
      );
    
    return (
        <div>
            {loadingScreen}
        </div>
    );
}

export default LogoGenPage;
