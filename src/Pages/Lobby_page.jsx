import React, { useState, useEffect } from "react";

function Lobby() {
    const [data, setData] = useState([]);

    const GetData = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/GetData');
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
                {data.map((player, index) => (
                    <div key={index}>
                        {player[1] + " " + player[2]} 
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Lobby;
