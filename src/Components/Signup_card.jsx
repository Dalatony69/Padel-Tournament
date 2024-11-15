import React, { useState, useCallback} from "react";
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser'

function Signup_card() {
    const [UserName1, setUserName1] = useState('');
    const [UserName2, setUserName2] = useState('');
    const [UserPhone1, setUserPhone1] = useState('');
    const [UserPhone2, setUserPhone2] = useState('');
    const [Email, setEmail] = useState('');
    const [Passcode, setPasscode] = useState('');
    const [OTP, setOTP] = useState('');
    const [OTP1, setOTP1] = useState('');
    const [Check,setCheck] = useState(false);
    const navigate = useNavigate();

    const WhereTo = useCallback(async (Teamid) => {
        alert(Teamid);
        try {
            const response = await fetch('http://13.61.73.123:5000/WhereTo');
            const data = await response.json(); // Assuming the backend returns JSON
            if (data.message !== 'Lobby') {
                navigate('/Lobby',{ state: { Teamid,UserName1,UserName2 } });
            } else {
                navigate('/Home');
            }
        } catch (error) {
            console.error('Error fetching WhereTo data:', error);
        }
    }, [navigate]);

    const handlesignup = useCallback(async () => {
        const newUser = {
            UserName1,
            UserName2,
            UserPhone1,
            UserPhone2,
            Passcode
        };

        try {
            const response = await fetch('http://13.61.73.123:5000/HandleSignUp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json(); // Use response.json() if the backend returns JSON
            const Teamid = data['team_id'];
            test();
            WhereTo(Teamid);
        } catch (error) {
            console.error('Error handling sign-up:', error);
        }
    }, [UserName1, UserName2, UserPhone1, UserPhone2, Passcode, WhereTo]);

    const test = () => {
        const Player1Data = `${UserName1} - ${UserPhone1}`;
        const Player2Data = `${UserName2} - ${UserPhone2}`;

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

    const SendOTP = () =>{
        setCheck(true);
        const otp = Math.floor(100000 + Math.random() * 900000);
        setOTP(otp);
        
        emailjs.send('service_1a6hsjk', 'template_44zc1hj', {otp,Email}, '-npZe43yTWeFS0AAO')
        .then((result) => {
            console.log('Email sent successfully:', result.text);
        }, (error) => {
            console.error('Error sending email:', error);
        }); 
    }
    const CheckOTP = () =>{
        const x = parseInt(OTP);
        const y = parseInt(OTP1);
        if(x === y){
            alert(OTP + ' = ' +OTP1)
            handlesignup();
        }
        else{
            alert('wrong'+ OTP + "" + OTP1);
        }
    }
    
    return (
        <div className="sign-up-card">
            <div className="holder" style={{display : Check ? 'none' : 'block'}}>
                <input 
                    type="text" 
                    placeholder="Player 1 Username" 
                    value={UserName1} 
                    onChange={(e) => setUserName1(e.target.value)} 
                />
                <input 
                    type="text" 
                    placeholder="Player 1 Phone-Number" 
                    value={UserPhone1} 
                    onChange={(e) => setUserPhone1(e.target.value)} 
                />
                <input 
                    type="text" 
                    placeholder="Player 2 Username" 
                    value={UserName2} 
                    onChange={(e) => setUserName2(e.target.value)} 
                />
                <input 
                    type="text" 
                    placeholder="Player 2 Phone-Number" 
                    value={UserPhone2} 
                    onChange={(e) => setUserPhone2(e.target.value)} 
                />
                <input 
                    type="text" 
                    placeholder="Email" 
                    value={Email} 
                    onChange={(e) => setEmail(e.target.value)} 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={Passcode} 
                    onChange={(e) => setPasscode(e.target.value)} 
                />
            </div>
            <div className="button">
                <button style={{display : Check ? 'none' : 'block'}} onClick={SendOTP}>Sign-up</button>
            </div>

            <div  className="OtpCheck" style={{display : Check ? 'block' : 'none'}}>
                <main>
                    <span>Please Enter The OTP</span>
                    <input 
                            type="text" 
                            placeholder="Enter the OTP" 
                            value={OTP1} 
                            onChange={(e) => setOTP1(e.target.value)} 
                        />
                        <button onClick={CheckOTP}>Submit</button>
                </main>
            </div>
               
        </div>
    );
}

export default Signup_card;
