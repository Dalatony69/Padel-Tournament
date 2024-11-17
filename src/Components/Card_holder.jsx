import React, { useState, useCallback } from "react";
import SignupCard from "./Signup_card";
import LoginCard from "./Login_card";

function CardHolder() {
    const [Switch, setSwitch] = useState('login');

    const switchCards = useCallback((s) => {
        setSwitch(s);
    }, []);

    return (
        <div className="card-holder">
            <div className="selectors">
                <span onClick={() => switchCards('sign')} style={{borderBottom : Switch === 'login' ? 'none' : '3px solid #5f8dff' }}>Sign-up</span>
                <span onClick={() => switchCards('login')} style={{borderBottom : Switch !== 'login' ? 'none' : '3px solid #5f8dff' }}>Log-in</span>
            </div>
            <div className="sub-holder">
                {Switch === 'login' ? <LoginCard /> : <SignupCard />}
            </div>
        </div>
    );
}

export default CardHolder;

// FULLY FINISHED WAITING FOR THE DOUBLE CHECK
