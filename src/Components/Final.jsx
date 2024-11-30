import React, { useState,useEffect,useMemo } from "react";
import { useLocation } from 'react-router-dom';

function Final(props) {
    const location = useLocation();
    const isAdminRoute = useMemo(() => location.pathname === "/Admin", [location.pathname]);
    const [F1, setF1] = useState(null);
    const [F1Score, setF1Score] = useState(null);   
    const [F2, setF2] = useState(null);
    const [F2Score, setF2Score] = useState(null); 
    const [F, setF] = useState(null);
    const [VisibleF, setVisibleF] = useState(true);

    const [Team1score, setTeam1score] = useState();
    const [Team2score, setTeam2score] = useState();

    const HandleFinal = async () => {
        try {
            const response = await fetch('http://13.61.73.123:5000/ShowFinalQualifiers');
            if (!response.ok) {
                alert('Network response was not ok');
                return;
            }

            const jsonData = await response.json();

            setF1(`${jsonData[0].team1_player1} <br /> ${jsonData[0].team1_player2}`);
            setF1Score(`${jsonData[0].team1_score}`);
            setF2(`${jsonData[0].team2_player1} <br />${jsonData[0].team2_player2}`);
            setF2Score(`${jsonData[0].team2_score}`);
            setF(`${jsonData[0].game_id}`);

        } catch (e) {
            alert("Error");
        }
    };

    const HandleWinner = async(game_id) => {
        alert(Team1score + Team2score + game_id);

        const newgame = {
            Team1score: Team1score,
            Team2score: Team2score,
            game_id: game_id
        };

        try {
            const response = await fetch('http://13.61.73.123:5000/Winner', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newgame)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                alert("yes");
            }

            const data = await response.text(); // Use response.json() if the backend returns JSON
            alert(data);

        } catch (error) {
            console.error('There was an errorrrrrrrrrrrrrrr!', error);
        }
    };

    useEffect(() => {
        // Define the async function inside useEffect
        const checkfinal = async () => {
            try {
                const response = await fetch('http://13.61.73.123:5000/CheckSettingFinal');
                const data = await response.json(); // Assuming the backend returns JSON

                if (data['message'] === 'Yes') {
                    HandleFinal();
                } else {
                    console.log('hi');
                }
            } catch (error) {
                console.error('Error fetching setting data:', error);
            }
        };


        // Call the async function
        checkfinal()
    }, []);

    return (
        <div className="final">
            <div className="title"><h1>Final Qualifiers</h1></div>
            <button onClick={HandleFinal} style={{display : props.admin === 'YES' ? 'block' : 'none'}}>Show Final</button>

            <div className="F">
                <main>
                    <div dangerouslySetInnerHTML={{ __html: F1 || "Final" }}></div><div style={{display: VisibleF  ? 'block' : 'none'}}>{F1Score}</div>
                </main>

                <button 
                    onClick={() => { setVisibleF(!VisibleF) }} 
                    style={{ display: (!VisibleF || F1Score !== 'null' || F2Score !== 'null' || !isAdminRoute) ? 'none' : 'block'}}>
                    Start
                </button>

                <div className="setscore" style={{ display: VisibleF ? 'none' : 'flex' }}>
                    <input type="text" onChange={(e) => { setTeam1score(e.target.value) }} />
                    <button onClick={() => { HandleWinner(F) }}>Submit</button>
                    <input type="text" onChange={(e) => { setTeam2score(e.target.value) }} />
                </div>

                <main style={{justifyContent: VisibleF  ? 'space-between' : 'end'}}>
                    <div style={{display: VisibleF  ? 'block' : 'none'}}>{F2Score}</div><div dangerouslySetInnerHTML={{ __html: F2 || "Final" }}></div>
                </main>
            </div>
        </div>
    );
}

export default Final;
