import React,{useState,useEffect} from "react";

function WaitingList_Card(){

    const [WaitingListdata, setWaitingListdata] = useState([]);

    const GetWaiters = async () => {
        try {
            const response = await fetch('http://13.61.73.123:5000/WaitingList');
            const waitingListData = await response.json();
            setWaitingListdata(waitingListData);
        } catch (error) {
            console.error('There was an error fetching the data!', error);
        }
    };

    const Accept = async(value) =>{
        
        try {
            const teamid = {
                Teamid : value
            }
            const response = await fetch('http://13.61.73.123:5000/AcceptTeam', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(teamid)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

        } catch (error) {
            console.error('Error handling sign-up:', error);
        }
    }
    useEffect(() => {
        GetWaiters();
    }, []);

    return(
        <div className="data">
            {WaitingListdata.map((player, index) => (
                <div key={index} style={{
                    backgroundColor: player[4] === "YES" ? '#55aaff' : '#fff',
                    color: player[4] === "YES" ? 'white' : 'black',
                    borderRadius: '5px'
                    }}>
                    <span>{"Team " + ++index}</span>
                    <span> {player[1] + " & " + player[2]} </span>
                    <button onClick={() => { Accept(player[0]) }}>accept</button>
                </div>
                ))}
        </div>
    );

}
export default WaitingList_Card;