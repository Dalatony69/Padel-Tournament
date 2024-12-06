import React, { useState, useEffect, useCallback } from "react";
import GroupSec from "../Components/Groups_sec";
import "../css/admin_page.css";
// import KnockoutSec from "../Components/Knockout_sec";
import WaitingListCard from "../Components/WaitingList_Card";
import LobbyCard from "../Components/Lobby_Card";
import Swal from "sweetalert2";

function Admin_Page() {
    
  const [Anchor, setAnchor] = useState("");

  const Restart = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/Terminate");
      if (response) {
        Swal.fire("Success", "All data has been deleted and restarted.", "success");
      }
    } catch (e) {
      Swal.fire("Error", "Problem with restarting: " + e.message, "error");
    }
  };

  const CreateFixtures = useCallback(() => {
    fetch("http://127.0.0.1:5000/CreateFixtures")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        Swal.fire("Success", "Tournament fixtures created.", "success");
      })
      .catch((err) => {
        Swal.fire("Error", "Problem with creating fixtures: " + err.message, "error");
      });
  }, []);

  const SetQualifiers = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/SetQualifiers");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      Swal.fire("Success", "Qualifiers set successfully.", "success");
    } catch (e) {
      Swal.fire("Error", "Problem with setting qualifiers: " + e.message, "error");
    }
  };

  const SetSemiQualifiers = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/SetSemiQualifiers");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      Swal.fire("Success", "Semi-final qualifiers set successfully.", "success");
    } catch (e) {
      Swal.fire("Error", "Problem with setting semi-final qualifiers: " + e.message, "error");
    }
  };

  const SetFinalQualifiers = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/SetFinalQualifiers");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      Swal.fire("Success", "Final qualifiers set successfully.", "success");
    } catch (e) {
      Swal.fire("Error", "Problem with setting final qualifiers: " + e.message, "error");
    }
  };

  const HandleSafety = (Type) => {
    let action;
    let message;

    switch (Type) {
      case "restart":
        action = Restart;
        message = "This will DELETE all data and start over. Are you sure?";
        break;
      case "QualifyToFinal":
        action = SetFinalQualifiers;
        message = "Make sure all the semi-final matches are finished. Proceed?";
        break;
      case "QualifyToSemiFinal":
        action = SetSemiQualifiers;
        message = "Make sure all the quarter-final matches are finished. Proceed?";
        break;
      case "SetQualifiers":
        action = SetQualifiers;
        message = "Make sure all the group matches are finished. Proceed?";
        break;
      case "StartTournament":
        action = CreateFixtures;
        message = "Make sure the lobby is completed. Proceed to start the tournament?";
        break;
      default:
        return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: message,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, proceed",
    }).then((result) => {
      if (result.isConfirmed) {
        action();
      }
    });
  };

  const check = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/LobbyOrHome");
      const Anchor = await response.json();
      setAnchor(Anchor[0]);
    } catch (error) {
      console.error("There was an error fetching the data!", error);
    }
  };

  useEffect(() => {
    check();
  }, []);

  return (
    <div className="admin-page">
      <div className="admin-holder">
        {Anchor === "Home" && (
          <>
            <GroupSec />
            {/* <KnockoutSec /> */}
          </>
        )}
        {Anchor === "Lobby" && (
          <div className="lobby">
            <div className="holder">
              <WaitingListCard />
              <LobbyCard />
            </div>
          </div>
        )}
      </div>

      <div className="settings">

        <main className="title">
          <span>Tournament Setting</span>
        </main>

        <main className="holder">
          <div className="CreateFixtures cat">
            <button onClick={() => HandleSafety("StartTournament")}>Start Tournament</button>
            <div className="instruct">
              <span>* Getting the lobby players and starting the group-stage *</span>
            </div>
          </div>

          <div className="QualifyQuarter cat">
            <button onClick={() => HandleSafety("SetQualifiers")}>Qualify to Quarter-Final</button>
            <div className="instruct">
              <span>* After finishing the group stage, qualify the top candidates to the quarter-final *</span>
            </div>
          </div>

          <div className="QualifySemi cat">
            <button onClick={() => HandleSafety("QualifyToSemiFinal")}>Qualify to Semi-Final</button>
            <div className="instruct">
              <span>* After finishing the quarter-final, qualify the winners to the semi-final *</span>
            </div>
          </div>

          <div className="QualifyFinal cat">
            <button onClick={() => HandleSafety("QualifyToFinal")}>Qualify to Final</button>
            <div className="instruct">
              <span>* After finishing the semi-final, qualify the winners to the final *</span>
            </div>
          </div>

          <div className="restart-btn cat">
            <button onClick={() => HandleSafety("restart")}>Restart</button>
            <div className="instruct">
              <span>* Delete all data and start over *</span>
            </div>
         </div>

        </main>
      </div>
    </div>
  );
}

export default Admin_Page;
