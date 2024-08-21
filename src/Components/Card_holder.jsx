import React, { useState, useCallback } from "react";
import SignupCard from "./Signup_card";
import LoginCard from "./Login_card";

function Card_holder() {
    const [isLogin, setIsLogin] = useState(true);

    const switchCards = useCallback(() => {
        setIsLogin(prev => !prev);
    }, []);

    return (
        <div className="card-holder">
            {isLogin ? <LoginCard /> : <SignupCard />}
            <button onClick={switchCards}>
                {isLogin ? "Create Account" : "Already Have an Account"}
            </button>
        </div>
    );
}

export default Card_holder;
