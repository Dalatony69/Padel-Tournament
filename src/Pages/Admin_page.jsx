import React,{useState,useEffect,useCallback} from "react";
import Hello from '../Components/Groups_sec'
// import Fixtures from "../Components/Fixtures";
import QuarterFinal from "../Components/QuarterFinal";
import SemiFinal from "../Components/SemiFinal";
import Final from "../Components/Final";
// import { json } from "react-router-dom";

function Admin_Page(){

    const [WaitingListdata, setWaitingListdata] = useState([]);
    // const [Acceptedid,setAcceptedid] = useState('');

    const Restart = async() =>{
        try{
            const response = await fetch('http://13.61.73.123:5000/Terminate');
                if (response) {
                    alert(response.json);
                    }
               }
        catch(e){
                alert("Problem with DELETING " + e);
               }
    }

    const GetData = async () => {
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

    const CreateFixtures = useCallback(() => {
        fetch("http://13.61.73.123:5000/CreateFixtures")
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .catch((err) => {
            alert("ERRRRRRRRRRRRRR" + err);
          });
      }, []);

    useEffect(() => {
        GetData();
    }, []);



    return(
        <div className="admin-page">
            <Hello />
            {/* <Fixtures group_id={'A'} admin={'YES'}/>
            <Fixtures group_id={'B'} admin={'YES'}/>
            <Fixtures group_id={'C'} admin={'YES'}/>
            <Fixtures group_id={'D'} admin={'YES'}/> */}
            <QuarterFinal admin={'YES'}/>
            <SemiFinal admin={'YES'}/>
            <Final admin={'YES'}/>

            <div className="CreateFixtures">
                <button onClick={CreateFixtures}>Start Tournament</button>
            </div>

            <div className="QualifyQuarter">
                <button>Qualify to Quarter-Final</button>
            </div>

            <div className="QualifySemi">
                <button>Qualify to Semi-Final</button>
            </div>

            <div className="QualifyFinal">
                <button>Qualify to Final</button>
            </div>
            <div className="restart-btn">
                <button onClick={Restart}>Restart</button>
            </div>

            <div className="lobby">
                        <div className="holder">
                            <div className="data">
                                {WaitingListdata.map((player, index) => (
                                    <div key={index} style={{
                                        backgroundColor: player[4] === "YES" ? '#55aaff' : '#fff',
                                        color: player[4] === "YES" ? 'white' : 'black',
                                        borderRadius: '5px'
                                    }}>
                                        <span>{"Team " + ++index}</span>
                                        <span> {player[1] + " & " + player[2]} </span>
                                        <button onClick={()=>{Accept(player[0])}}>accept</button>
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
        </div>
    );
}
export default Admin_Page