import React,{useState,useEffect} from "react";

function Lobby_Card(){
    const [Lobbydata, setLobbyData] = useState([]);

    const GetPlayers = async () => {
        try {
            const response = await fetch('http://13.61.73.123:5000/LobbyData');
            const lobbydata = await response.json();
            setLobbyData(lobbydata);
        } catch (error) {
            console.error('There was an error fetching the data!', error);
        }
    };

    useEffect(() => {
        GetPlayers();
    }, []);

    return(
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
    );

}
export default Lobby_Card;