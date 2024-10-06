import React, { useState, useEffect } from "react";

function Lobby() {
    const [data, setData] = useState([]);

    const GetData = async () => {
        try {
            const response = await fetch('http://51.20.32.239:5000/GetData');
            const players = await response.json(); // Parse the response as JSON

            setData(players);
        } catch (error) {
            console.error('There was an error fetching the data!', error);
        }
    };

    useEffect(() => {
        GetData();
    }, []);

    return (
        <div className="lobby">
            <div className="holder">
                <div className="data">
                    {data.map((player, index) => (
                        <div key={index}>
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
                            <div>Book of Rules</div>
                        </div>
                        <div className="ball">
                            <div></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Lobby;
