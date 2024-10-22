import React, { useState, useEffect, useCallback } from "react";
import Modal from '../Components/Modal';  // Import the Modal component

function Fixtures(props) {
  const [game, setgame] = useState([]);
  const [Fixtures, setFixtures] = useState([]);
  const [Visible, setVisible] = useState(false);
  const [Team1score, setTeam1score] = useState();
  const [Team2score, setTeam2score] = useState();
  
  const loser = "#B81D1344";
  const winner = "#00845044";

  const HandleGame = async (Gameid) => {
    const newgame = {
      Team1score: Team1score,
      Team2score: Team2score,
      Gameid: Gameid,
    };
    alert(Team1score + Team2score + Gameid);

    try {
      const response = await fetch("http://51.20.32.239:5000/SetGameScore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newgame),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        alert("yes");
      }

      const data = await response.text();
      alert(data);
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  const CreateFixtures = useCallback(() => {
    fetch("http://51.20.32.239:5000/CreateFixtures")
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

  const GetFixtures = useCallback(() => {
    fetch("http://51.20.32.239:5000/GetFixtures")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((jsonData) => {
        const formattedData = jsonData.map((row) => ({
          game_id: row.game_id,
          team1_player1: row.team1_player1,
          team1_player2: row.team1_player2,
          team1_score: row.team1_score,
          team2_player1: row.team2_player1,
          team2_player2: row.team2_player2,
          team2_score: row.team2_score,
          game_stage: row.game_stage,
        }));
        setgame(formattedData);
      })
      .catch((err) => {
        alert("Error fetching fixtures: " + err.message);
      });
  }, []);

  useEffect(() => {
    GetFixtures();
  }, [GetFixtures]);

  useEffect(() => {
    const manageFixtures = () => {
      const filteredFixtures = game.filter(
        (g) => g.game_stage === `Group ${props.group_id}`
      );
      setFixtures(filteredFixtures);
    };
    manageFixtures();
  }, [game, props.group_id]);

  return (
    <div className="Fixtures">
      <div>
        <button
          onClick={CreateFixtures}
          style={{ display: props.admin === "YES" ? "inline" : "none" }}
        >
          Gamesss
        </button>

        <button onClick={() => setVisible(!Visible)}>
          {Visible ? "Hide" : "Show"} Results
        </button>
      </div>

      <Modal isVisible={Visible} onClose={() => setVisible(false)} className="modal-container">
        {Fixtures.map((fixture, index) => (
          <main key={index}>
            <div className="left-team" style={{backgroundColor: fixture.team1_score === fixture.team2_score ? 'none' : fixture.team1_score > fixture.team2_score ? winner : loser}}>
              <div>{fixture.team1_player1}</div>
              <div>|</div>
              <div>{fixture.team1_player2}</div>
            </div>
            
            <div className="score-team">
                <div>{fixture.team1_score}</div>
                <div>{fixture.team2_score}</div>
            </div>

            <div className="right-team" style={{backgroundColor: fixture.team2_score === fixture.team1_score ? 'none' : fixture.team2_score > fixture.team1_score ? winner : loser}}>
              <div>{fixture.team2_player1}</div>
              <div>|</div>
              <div>{fixture.team2_player2}</div>
            </div>

            <button
              onClick={() => setVisible(fixture.game_id)}
              style={{
                display:
                  Visible !== fixture.game_id &&
                  fixture.team1_score === 0 &&
                  fixture.team2_score === 0 &&
                  props.admin === "YES"
                    ? "block"
                    : "none",
              }}
            >
              Yala
            </button>

            <div
              className="setting"
              style={{ display: Visible === fixture.game_id ? "flex" : "none" }}
            >
              <input
                type="text"
                onChange={(e) => {
                  setTeam1score(e.target.value);
                }}
              />
              <button onClick={() => HandleGame(fixture.game_id)}>Save</button>
              <input
                type="text"
                onChange={(e) => {
                  setTeam2score(e.target.value);
                }}
              />
            </div>
          </main>
        ))}
      </Modal>
    </div>
  );
}

export default Fixtures;
