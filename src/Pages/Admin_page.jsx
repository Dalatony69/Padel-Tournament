import React,{useState,useEffect,useCallback} from "react";
import GroupSec from '../Components/Groups_sec'
import '../css/admin_page.css'
// import KnockoutSec from "../Components/Knockout_sec";
import WaitingListCard from "../Components/WaitingList_Card";
import LobbyCard from "../Components/Lobby_Card";
import AlertCard from "../Components/Alert_Card"


function Admin_Page(){


    const [Anchor,setAnchor] = useState('');
    const [AlertVisible, setAlertVisible] = useState(false);
    const [AlertHeader,setAlertHeader] = useState('');
    const [AlertInfo,setAlertInfo] = useState('');
    const [AlertType,setAlertType] = useState('');
    const [Func,setFunc] = useState('');

    const Restart = async() =>{
        try{
            const response = await fetch('http://127.0.0.1:5000/Terminate');
                if (response) {
                    alert(response.json);
                    }
               }
        catch(e){
                alert("Problem with DELETING " + e);
               }
    }

    const CreateFixtures = useCallback(() => {
        fetch("http://127.0.0.1:5000/CreateFixtures")
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
            const response = await fetch('http://127.0.0.1:5000/LobbyOrHome');
            const Anchor = await response.json();
            setAnchor(Anchor[0]);
        } catch (error) {
            console.error('There was an error fetching the data!', error);
        }
    }

    const SetQualifiers = async() =>{
        try {
            const response = await fetch('http://127.0.0.1:5000/SetQualifiers');
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
            const response = await fetch('http://127.0.0.1:5000/SetSemiQualifiers');
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
            const response = await fetch('http://127.0.0.1:5000/SetFinalQualifiers');
            if (!response.ok) {
                alert('Network response was not ok');
                return;
            }
        }
        catch(e){
            alert("Problem with SETTING QUALIFIERS " + e);
        }
    }

    const HandleSafety = (Type) =>{

        switch (Type) {  
            case "restart":
                setAlertHeader('Are You Sure');
                setAlertInfo('This will DELETE all data and start over');
                setAlertType('RED');
                setFunc(Type);
                break;

            case "QualifyToFinal":
                setAlertHeader('Are You Sure');
                setAlertInfo('Make Sure that all the semi final matches are finished');
                setAlertType('RED');
                setFunc(Type);
                break;
            
            case "QualifyToSemiFinal":
                setAlertHeader('Are You Sure');
                setAlertInfo('Make Sure that all the quarter final matches are finished');
                setAlertType('RED');
                setFunc(Type);
                break;
           
            case "SetQualifiers":
                setAlertHeader('Are You Sure');
                setAlertInfo('Make Sure that all the Groups matches are finished');
                setAlertType('RED');
                setFunc(Type);
                break;

            case "StartTournament":
                setAlertHeader('Are You Sure');
                setAlertInfo('Make Sure the Lobby is Completed');
                setAlertType('RED');
                setFunc(Type);
                break;
        }

        setAlertVisible(true);
    }

    const onDecision = (decision) => {

        setAlertVisible(false); 

        if (decision) {
            switch (Func) {  
                case "restart":
                    Restart();
                    break;
    
                case "QualifyToFinal":
                    SetFinalQualifiers();
                    break;

                case "QualifyToSemiFinal":
                    SetSemiQualifiers();
                    break;

                case "SetQualifiers":
                    SetQualifiers();
                    break;

                case "StartTournament":
                    CreateFixtures();
                    break;
            }
        }
      };

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
                        {/* <KnockoutSec /> */}
                    </>
                )}
                {Anchor === 'Lobby' && (
                    <div className="lobby">
                        <div className="holder">
                            <WaitingListCard/>
                            <LobbyCard/>
                        </div>
                    </div>
                )}
            </div>

            {AlertVisible && <AlertCard Header={AlertHeader} Info={AlertInfo} Type={AlertType} onDecision={onDecision}/>}
                
            <div className="settings">

                <main className="title"><span>Tournament Setting</span></main>
                
                <main className="holder">
                    <div className="CreateFixtures cat">
                        
                        <button onClick={() => HandleSafety("StartTournament")}>Start Tournament</button>
                        
                        <div className="instruct">
                            <span>* Getting the lobby players and starting the group-stage * </span>
                        </div>

                    </div>

                    <div className="QualifyQuarter cat">

                        <button onClick={() => HandleSafety("SetQualifiers")}>Qualify to Quarter-Final</button>
                        
                        <div className="instruct">
                            <span>* After Finishing the group-stage starting the quarter-final qualifying the top candidates *</span>
                        </div>

                    </div>

                    <div className="QualifySemi cat">

                        <button onClick={() => HandleSafety("QualifyToSemiFinal")}>Qualify to Semi-Final</button>
                       
                        <div className="instruct">
                            <span>* After Finishing the Quarter-Final starting the Semi-final qualifying the Winners *</span>
                        </div>

                    </div>

                    <div className="QualifyFinal cat">

                        <button onClick={() => HandleSafety("QualifyToFinal")}>Qualify to Final</button>

                        <div className="instruct">
                            <span>* After Finishing the Semi-Final starting the Final qualifying the Winners *</span>
                        </div>

                    </div>
                    <div className="restart-btn cat">

                        <button onClick={() => HandleSafety("restart")}>Restart</button>

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