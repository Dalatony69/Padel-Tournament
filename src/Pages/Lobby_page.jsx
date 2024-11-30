import React, { useState, useEffect, useCallback } from "react";
import Header from "../Components/Header";
import '../css/lobby_page.css';
import { useLocation } from 'react-router-dom';
import Lobby_Card from '../Components/Lobby_Card';

function Lobby_page() {
    const [state, setState] = useState({
        data: [],
        isWaiting: true,
        teamId: null
    });

    const location = useLocation();
    const { id } = location.state || {};

    // To prevent any unnecessary re-renders
    const checkTeamStatus = useCallback((teams) => {
        const team = teams.find((team) => team[0] === Number(id));
        
        if (team) {
            console.log("Team found:", team);
            if (team[13] !== 'Waiting') {
                setState((prevState) => ({
                    ...prevState,
                    isWaiting: false
                }));
            } else {
                console.log('Status is Waiting');
            }
        } else {
            console.warn("Team with matching ID not found.");
        }
    }, [id]);

    const fetchData = useCallback(async () => {
        try {
            const response = await fetch('http://13.61.73.123:5000/GetData');
            const teamsData = await response.json();

            setState((prevState) => ({
                ...prevState,
                data: teamsData
            }));
            checkTeamStatus(teamsData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, [checkTeamStatus]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <>
            {state.isWaiting ? (
                <div className="waitingpanel">
                    <span>Waiting for the Host Approval</span>
                </div>
            ) : (
                <>
                    <Header />
                    <div className="lobby">
                        <div className="holder">
                            <Lobby_Card />
                            <div className="emoji">
                                <span className="title">
                                    The Tournament will start on 1/12/2024 at 9:00 PM
                                </span>
                                <div className="lucky">
                                    <div className="notes">
                                        <span>PLEASE READ <br /> THE RULES</span>
                                        <button>Book of Rules</button>
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

export default Lobby_page;

// FULLY FINISHED WAITING FOR THE DOUBLE CHECK