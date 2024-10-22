import React from "react";
import CardHolder from "../Components/Card_holder";
import AuthHeader from "../Components/Auth_Header";

function Auth(){
    return(
        <>
        <div className="header">
            <AuthHeader />
        </div>
        <div className="auth-page">
            <div className="holder">
                <CardHolder/>
            </div>
        </div>
        </>
    );
}
export default Auth;