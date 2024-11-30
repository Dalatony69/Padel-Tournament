import React, { useState, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { bouncy } from 'ldrs'

// Reusable Input Component
const InputField = ({ value, onChange, placeholder, type = "text", name }) => (
    <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
    />
);

// Reusable Button Component
const Button = ({ onClick, label, style }) => (
    <button onClick={onClick} style={style}>{label}</button>
);

function Login_card() {
    // Combined state object for user data
    const [user, setUser] = useState({
        Teamid: '',
        Passcode: '',
    });
    
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    bouncy.register()

    // Function to navigate based on response data
    const WhereTo = useCallback(async (id, Name1, Name2) => {
        try {
            const response = await fetch('http://13.61.73.123:5000/WhereTo');
            const data = await response.json();
            
            if (data.message === 'Lobby') {
                navigate('/Lobby', { state: { id, Name1, Name2 } });
            } else {
                navigate('/Home', { state: { id, Name1, Name2 } });
            }
        } catch (error) {
            console.error('Error fetching WhereTo data:', error);
            alert('An error occurred. Please try again.');
        }
    }, [navigate]);

    // Function to fetch players and navigate to appropriate page
    const GetPlayers = useCallback(async () => {
        try {
            const response = await fetch('http://13.61.73.123:5000/GetPlayers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Teamid: user.Teamid }),
            });
            const Players = await response.json();
            WhereTo(user.Teamid, Players[0], Players[1]);
        } catch (error) {
            console.error('There was an error fetching the players!', error);
            alert('Failed to fetch player data. Please try again.');
        }
    }, [user.Teamid, WhereTo]); 

    // Function to handle login form submission
    const handleLogin = useCallback(async () => {
        const { Teamid, Passcode } = user;
        setLoading(true);
        try {
            const response = await fetch('http://13.61.73.123:5000/ValidateUser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Teamid, Passcode }),
            });
            if (!response.ok) {
                console.error('Error validating user');
                alert('Invalid credentials. Please try again.');
                setLoading(false);
                return;
            }

            const data = await response.json();
            console.log('Login successful:', data);

            // Fetch players and navigate to the appropriate page
            GetPlayers();
        } catch (error) {
            console.error('Error validating user:', error);
            alert('An error occurred while validating user. Please try again.');
        }
    }, [user, GetPlayers]);

    // Handler for input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    return (
        <div className="login-card">
            <div className="holder">
                <InputField
                    name="Teamid"
                    value={user.Teamid}
                    onChange={handleInputChange}
                    placeholder="Team-ID"
                />
                <InputField
                    name="Passcode"
                    type="password"
                    value={user.Passcode}
                    onChange={handleInputChange}
                    placeholder="Password"
                />
            </div>
            <div className="button">

                    {
                        loading ?
                        <div className="loading-spinner" style={{display : 'flex' , justifyContent : 'center'}}><l-bouncy size="45" speed="1.75" color="black"></l-bouncy></div>
                        :
                        <Button onClick={handleLogin} label="Login" />
                    }

                
            </div>
        </div>
    );
}

export default Login_card;

// FULLY FINISHED WAITING FOR THE DOUBLE CHECK
