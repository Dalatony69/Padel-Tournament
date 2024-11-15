import React, { useState, useEffect, useCallback } from "react";

function WaitingList_Card() {
    const [state, setState] = useState({
        waitingListData: [],
    });

    // Fetch data for the waiting list
    const getWaiters = useCallback(async () => {
        try {
            const response = await fetch('http://13.61.73.123:5000/WaitingList');
            if (!response.ok) {
                throw new Error('Failed to fetch waiting list data');
            }
            const data = await response.json();
            setState((prevState) => ({
                ...prevState,
                waitingListData: data,
            }));
        } catch (error) {
            console.error('Error fetching waiting list data:', error);
        }
    }, []);

    // Accept a team into the tournament
    const acceptTeam = useCallback(async (value) => {
        try {
            const teamid = { Teamid: value };
            const response = await fetch('http://13.61.73.123:5000/AcceptTeam', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(teamid),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error handling accept team:', error);
        }
    }, []);

    useEffect(() => {
        getWaiters();
    }, [getWaiters]);

    return (
        <div className="data">
            {state.waitingListData.map((player, index) => (
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
                    <main>
                        <button onClick={() => acceptTeam(player[0])}>Accept</button>
                    </main>
                </div>
            ))}
        </div>
    );
}

export default WaitingList_Card;
