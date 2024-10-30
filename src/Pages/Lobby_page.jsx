import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import '../css/lobby_page.css';
import { useLocation } from 'react-router-dom';


function Lobby() {
    const [data, setData] = useState([]);
    const [Lobbydata, setLobbyData] = useState([]);
    const location = useLocation();
    const { Teamid } = location.state || {};
    const [isWaiting, setIsWaiting] = useState(true);


    const check = (teams) => {
        const team = teams.find(team => team[0] === Teamid);
        if (team && team[13] !== 'Waiting') {
            setIsWaiting(false);
        }
    };
    
    const fetchData = async () => {
        try {
            const responses = await Promise.all([
                fetch('http://13.61.73.123:5000/GetData'),
                fetch('http://13.61.73.123:5000/LobbyData'),
            ]);

            const [teamsData, lobbyData] = await Promise.all(responses.map(res => res.json()));

            setData(teamsData);
            setLobbyData(lobbyData);
            check(teamsData);  // Only call check once here
        } catch (error) {
            console.error('There was an error fetching the data!', error);
        }
    };
    
    

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            {isWaiting ? (
                <div className="waitinglist">
                    Waiting For Approval
                </div>
            ) : (
                <>
                    <Header />
                    <div className="lobby">
                        <div className="holder">
                            <div className="data">
                                {Lobbydata.map((player, index) => (
                                    <div key={index} style={{
                                        backgroundColor: player[4] === "YES" ? '#55aaff' : '#fff',
                                        color: player[4] === "YES" ? 'white' : 'black',
                                        borderRadius: '5px'
                                    }}>
                                        <span>{"Team " + ++index}</span>
                                        <span> {player[1] + " & " + player[2]} </span>
                                    </div>
                                ))}
                            </div>
                            <div className="emoji">
                                <span className="title">
                                    The Tournament will start in 1/12/2024  9:00 PM
                                </span>
                                <div className="lucky">
                                    <div className="notes">
                                        <span>PLEASE READ THE RULES</span>
                                        <button>Book of Rules</button>
                                    </div>
                                    <div className="ball">
                                        <div></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
    
}

export default Lobby;
