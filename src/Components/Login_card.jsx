import React, { useState, useCallback } from "react";
import { useNavigate } from 'react-router-dom';

function Login_card() {
    const [Teamid, setTeamid] = useState('');
    const [Passcode, setPasscode] = useState('');
    const [UserName1, setUserName1] = useState('');
    const [UserName2, setUserName2] = useState('');
    const navigate = useNavigate();

    const WhereTo = useCallback(async (id,Name1,Name2) => {
        try {
            alert(Name1+Name2);
            const response = await fetch('http://13.61.73.123:5000/WhereTo');
            const data = await response.json();
            if (data.message === 'Lobby') {
                alert("heloooooooooooo"+data.message);
                navigate('/Lobby',{ state: {id,Name1,Name2} });
            } else {
                navigate('/Home',{ state: {id,Name1,Name2} });
            }
        } catch (error) {
            alert('errrooooooooooor')
            console.error('Error fetching WhereTo data:', error);
        }
    }, [navigate]);

    const GetPlayers = async() =>{
        try {
            const response = await fetch('http://13.61.73.123:5000/GetPlayers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ Teamid: Teamid })
            });
            const Players = await response.json();
            WhereTo(Teamid, Players[0], Players[1]);
        } catch (error) {
            console.error('There was an error fetching the data!', error);
        }
    }
    
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
    
            const data = await response.json();
            console.log('Login successful:', data);
            
            // Fetch players and navigate to the appropriate page
            GetPlayers();
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
