import React, { useState, useCallback } from "react";
import { useNavigate } from 'react-router-dom';

function Login_card() {
    const [Teamid, setTeamid] = useState('');
    const [Passcode, setPasscode] = useState('');
    const navigate = useNavigate();

    const WhereTo = useCallback(async () => {
        try {
            const response = await fetch('http://13.61.73.123:5000/WhereTo');
            const data = await response.json();
            if (data.message === 'Lobby') {
                navigate('/Lobby');
            } else {
                navigate('/Home');
            }
        } catch (error) {
            console.error('Error fetching WhereTo data:', error);
        }
    }, [navigate]);

    const handlelogin = useCallback(async () => {
        const newUser = {
            Teamid,
            Passcode,
        };

        try {
            const response = await fetch('http://13.61.73.123:5000/ValidateUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            });

            if (!response.ok) {
                console.error('Error validating user');
                return;
            }

            const data = await response.json(); // Use response.json() if the backend returns JSON
            console.log('Login successful:', data);
            WhereTo();
        } catch (error) {
            console.error('Error validating user:', error);
        }
    }, [Teamid, Passcode, WhereTo]);

    return (
        <div className="login-card">
            <div className="holder">
                <input 
                    type="text" 
                    placeholder="Team-ID" 
                    value={Teamid} 
                    onChange={(e) => setTeamid(e.target.value)} 
                />
                <input 
                    type="password"
                    placeholder="Password" 
                    value={Passcode} 
                    onChange={(e) => setPasscode(e.target.value)} 
                />
            </div>
            <div className="button">
                <button onClick={handlelogin}>Login</button>
            </div>
        </div>
    );
}

export default Login_card;
