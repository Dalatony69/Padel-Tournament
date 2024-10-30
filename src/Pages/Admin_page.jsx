import React,{useState,useEffect} from "react";
import Fixtures from "../Components/Fixtures";
import QuarterFinal from "../Components/QuarterFinal";
import SemiFinal from "../Components/SemiFinal";
import Final from "../Components/Final";
// import { json } from "react-router-dom";

function Admin_Page(){

    const [WaitingListdata, setWaitingListdata] = useState([]);

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

    useEffect(() => {
        GetData();
    }, []);


    return(
        <div className="admin-page">
            <Fixtures group_id={'A'} admin={'YES'}/>
            <Fixtures group_id={'B'} admin={'YES'}/>
            <Fixtures group_id={'C'} admin={'YES'}/>
            <Fixtures group_id={'D'} admin={'YES'}/>
            <QuarterFinal admin={'YES'}/>
            <SemiFinal admin={'YES'}/>
            <Final admin={'YES'}/>
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