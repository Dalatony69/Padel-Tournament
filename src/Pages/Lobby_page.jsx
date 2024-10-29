import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import '../css/lobby_page.css';

function Lobby() {
    const [data, setData] = useState([]);

    const GetData = async () => {
        try {
            const response = await fetch('http://13.61.73.123:5000/GetData');
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
        <>
        <Header />
        <div className="lobby">
            <div className="holder">
                <div className="data">
                    {data.map((player, index) => ( //Change to data.map(player, index)
                        <div key={index} style={{backgroundColor: player[4] === "YES" ? '#55aaff' : '#fff',
                            color: player[4] === "YES" ? 'white' : 'black',
                            borderRadius: '5px'
                        }}>
                            <span>{"Team " + ++index}</span>
                            <span> {player[1] + " & " + player[2]} </span>
                            {/* <span>{index}</span> */}
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

        <div>
        </div>
        </>
    );
}

export default Lobby;
