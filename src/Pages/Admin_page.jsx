import React,{useState,useEffect,useCallback} from "react";
import GroupSec from '../Components/Groups_sec'
import '../css/admin_page.css'
import KnockoutSec from "../Components/Knockout_sec";
import WaitingList_Card from "../Components/WaitingList_Card";
import Lobby_Card from "../Components/Lobby_Card";


function Admin_Page(){


    const [Anchor,setAnchor] = useState('');

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

    const check = async() =>{
        try {
            const response = await fetch('http://13.61.73.123:5000/LobbyOrHome');
            const Anchor = await response.json();
            setAnchor(Anchor[0]);
        } catch (error) {
            console.error('There was an error fetching the data!', error);
        }
    }

    const SetQualifiers = async() =>{
        try {
            const response = await fetch('http://13.61.73.123:5000/SetQualifiers');
            if (!response.ok) {
                alert('Network response was not ok');
                return;
            }
        }
        catch(e){
            alert("Problem with SETTING QUALIFIERS " + e);
        }
    }

    const SetSemiQualifiers = async() =>{
        try {
            const response = await fetch('http://13.61.73.123:5000/SetSemiQualifiers');
            if (!response.ok) {
                alert('Network response was not ok');
                return;
            }
        }
        catch(e){
            alert("Problem with SETTING QUALIFIERS " + e);
        }
    }

    const SetFinalQualifiers = async() =>{
        try {
            const response = await fetch('http://13.61.73.123:5000/SetFinalQualifiers');
            if (!response.ok) {
                alert('Network response was not ok');
                return;
            }
        }
        catch(e){
            alert("Problem with SETTING QUALIFIERS " + e);
        }
    }

    useEffect(() => {
        check();
        console.log("Anchor state:", Anchor[0]);
    }, []);



    return(
        <div className="admin-page">
            <div className="admin-holder">
                {Anchor === 'Home' && (
                    <>
                        <GroupSec />
                        <KnockoutSec />
                    </>
                )}
                {Anchor === 'Lobby' && (
                    <div className="lobby">
                        <div className="holder">
                            <WaitingList_Card/>
                            <Lobby_Card/>
                        </div>
                    </div>
                )}
            </div>

            <div className="settings">

                <main className="title"><span>Tournament Setting</span></main>
                
                <main className="holder">
                    <div className="CreateFixtures cat">
                        
                        <button onClick={CreateFixtures}>Start Tournament</button>
                        
                        <div className="instruct">
                            <span>* Getting the lobby players and starting the group-stage * </span>
                        </div>

                    </div>

                    <div className="QualifyQuarter cat">

                        <button onClick={SetQualifiers}>Qualify to Quarter-Final</button>
                        
                        <div className="instruct">
                            <span>* After Finishing the group-stage starting the quarter-final qualifying the top candidates *</span>
                        </div>

                    </div>

                    <div className="QualifySemi cat">

                        <button onClick={SetSemiQualifiers}>Qualify to Semi-Final</button>
                       
                        <div className="instruct">
                            <span>* After Finishing the Quarter-Final starting the Semi-final qualifying the Winners *</span>
                        </div>

                    </div>

                    <div className="QualifyFinal cat">

                        <button onClick={SetFinalQualifiers}>Qualify to Final</button>

                        <div className="instruct">
                            <span>* After Finishing the Semi-Final starting the Final qualifying the Winners *</span>
                        </div>

                    </div>
                    <div className="restart-btn cat">

                        <button onClick={Restart}>Restart</button>

                        <div className="instruct">
                            <span>* Deleting all data and starting over *</span>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
export default Admin_Page