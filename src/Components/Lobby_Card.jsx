import React, { useState, useEffect, useCallback } from "react";

function Lobby_Card() {
    const [state, setState] = useState({
        lobbyData: [],
    });

    // Fetch data for the lobby players
    const getPlayers = useCallback(async () => {
        try {
            const response = await fetch('http://13.61.73.123:5000/LobbyData');
            if (!response.ok) {
                throw new Error('Failed to fetch lobby data');
            }
            const data = await response.json();
            setState((prevState) => ({
                ...prevState,
                lobbyData: data,
            }));
        } catch (error) {
            console.error('Error fetching lobby data:', error);
        }
    }, []);

    useEffect(() => {
        getPlayers();
    }, [getPlayers]);

    return (
        <div className="data">
            {state.lobbyData.map((player, index) => (
                <div
                    key={index}
                    style={{
                        backgroundColor: player[4] === "YES" ? '#55aaff' : '#fff',
                        color: player[4] === "YES" ? 'white' : 'black',
                        borderRadius: '5px',
                    }}
                >
                    <span>{"Team " + ++index}</span>
                    <span> {player[1] + " & " + player[2]} </span>
                </div>
            ))}
        </div>
    );
}

export default Lobby_Card;

// FULLY FINISHED WAITING FOR THE DOUBLE CHECK