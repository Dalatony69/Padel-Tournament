import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { bouncy } from 'ldrs'

// Default values shown


const InputField = ({ value, onChange, placeholder, type = "text", name }) => (
    <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
    />
);

const Button = ({ onClick, label, style }) => (
    <button onClick={onClick} style={style}>{label}</button>
);

function Signup_card() {
    
    const [user, setUser] = useState({
        UserName1: '',
        UserName2: '',
        UserPhone1: '',
        UserPhone2: '',
        Email: '',
        Passcode: '',
    });

    const [otpData, setOtpData] = useState({
        generated: '',
        entered: '',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [check, setCheck] = useState(false);
    const navigate = useNavigate();
    bouncy.register()

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    // Send OTP to the email
    const SendOTP = () => {
        setCheck(true);
        const otp = Math.floor(100000 + Math.random() * 900000);
        setOtpData((prev) => ({
            ...prev,
            generated: otp,
        }));

        alert(otp)

        emailjs.send('service_1a6hsjk', 'template_44zc1hj', { otp, Email: user.Email }, '-npZe43yTWeFS0AAO')
            .then((result) => {
                console.log('Email sent successfully:', result.text);
            }, (error) => {
                console.error('Error sending email:', error);
                setError('Error sending OTP. Please try again.');
            });
    };

    // Check OTP entered by the user
    const CheckOTP = () => {
        const x = parseInt(otpData.generated);
        const y = parseInt(otpData.entered);

        if (x === y) {
            handlesignup();
        } else {
            setError('Incorrect OTP. Please try again.');
        }
    };

    // Handle user sign-up and navigate based on response
    const handlesignup = async () => {
        const newUser = { ...user };

        try {
            setLoading(true);
            const response = await fetch('http://13.61.73.123:5000/HandleSignUp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            const Teamid = data['team_id'];
            SendToHost();
            WhereTo(Teamid);
        } catch (error) {
            setError(error.message); // Display error message
            console.error('Error handling sign-up:', error);
        } finally {
            setLoading(true);
        }
    };

    // Send email with player data
    const SendToHost = () => {
        const Player1Data = `${user.UserName1} - ${user.UserPhone1}`;
        const Player2Data = `${user.UserName2} - ${user.UserPhone2}`;

        emailjs.send('service_rlvpprj', 'template_ihd0agq', {
            Player1Data,
            Player2Data,
        }, '-npZe43yTWeFS0AAO')
            .then((result) => {
                console.log('Email sent successfully:', result.text);
            }, (error) => {
                console.error('Error sending email:', error);
            });
    };

    // Handle where to navigate based on backend response
    const WhereTo = async (Teamid) => {
        try {
            const response = await fetch('http://13.61.73.123:5000/WhereTo');
            const data = await response.json();
            if (data.message === 'Lobby') {
                navigate('/Lobby', { state: { Teamid, ...user } });
            } else {
                navigate('/Home');
            }
        } catch (error) {
            console.error('Error fetching WhereTo data:', error);
        }
    };

    return (
        <div className="sign-up-card">
            {error && <div className="error-message">{error}</div>} {/* Display error message */}

            <div className="holder" style={{ display: check ? 'none' : 'block' }}>
                <InputField
                    placeholder="Player 1 Username"
                    value={user.UserName1}
                    onChange={handleInputChange}
                    name="UserName1"
                />
                <InputField
                    placeholder="Player 1 Phone-Number"
                    value={user.UserPhone1}
                    onChange={handleInputChange}
                    name="UserPhone1"
                />
                <InputField
                    placeholder="Player 2 Username"
                    value={user.UserName2}
                    onChange={handleInputChange}
                    name="UserName2"
                />
                <InputField
                    placeholder="Player 2 Phone-Number"
                    value={user.UserPhone2}
                    onChange={handleInputChange}
                    name="UserPhone2"
                />
                <InputField
                    placeholder="Email"
                    value={user.Email}
                    onChange={handleInputChange}
                    name="Email"
                    type="email"
                />
                <InputField
                    placeholder="Password"
                    value={user.Passcode}
                    onChange={handleInputChange}
                    name="Passcode"
                    type="password"
                />
            </div>

            <div className="button">
                <Button
                    label="Sign-up"
                    onClick={SendOTP}
                    style={{ display: check ? 'none' : 'block' }}
                />
            </div>

            <div className="OtpCheck" style={{ display: check ? 'block' : 'none' }}>
                <main>
                    <span>Please Enter The OTP</span>
                    <InputField
                        placeholder="Enter the OTP"
                        value={otpData.entered}
                        onChange={(e) => setOtpData((prev) => ({ ...prev, entered: e.target.value }))}
                        name="OTP"
                    />
                    {
                        loading ?
                        <div className="loading-spinner"><l-bouncy size="45" speed="1.75" color="black"></l-bouncy></div>
                        :
                        <Button label="Submit" onClick={CheckOTP} />
                    }
                </main>
            </div>
        </div>
    );
}

export default Signup_card;

// FULLY FINISHED WAITING FOR THE DOUBLE CHECK
