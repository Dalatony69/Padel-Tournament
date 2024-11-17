import React, { useState } from "react";
import Modal from "../Components/Modal"; // Import the Modal component
import { useLocation } from "react-router-dom";

function Fixtures({ fixtures }) {
    const [visible, setVisible] = useState(false);
    const [team1Score, setTeam1Score] = useState("");
    const [team2Score, setTeam2Score] = useState("");
    const [editGameId, setEditGameId] = useState(null); // Tracks the game being edited
    const location = useLocation();
    const isAdminRoute = location.pathname === "/Admin";

    const loserColor = "#B81D1344";
    const winnerColor = "#00845044";

    const handleGame = async gameId => {
        try {
            const payload = { Team1score: team1Score, Team2score: team2Score, Gameid: gameId };
            const response = await fetch("http://13.61.73.123:5000/SetGameScore", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Failed to update game score");

            setEditGameId(null);
        } catch (error) {
            console.error("Error updating game score:", error);
        }
    };

    return (
        <div className="Fixtures">
            <div>
                <button onClick={() => setVisible(!visible)}>
                    {visible ? "Hide" : "Show"} Results
                </button>
            </div>

            <Modal isVisible={visible} onClose={() => setVisible(false)} className="modal-container">
                {fixtures.map(fixture => {
                    const isEditing = editGameId === fixture.game_id;
                    const isUnplayedMatch =
                        fixture.team1_score === 0 && fixture.team2_score === 0; // Match is unplayed

                    const team1Style = {
                        backgroundColor:
                            isUnplayedMatch
                                ? "none" // No background color if the match isn't played
                                : fixture.team1_score > fixture.team2_score
                                ? winnerColor
                                : loserColor
                    };

                    const team2Style = {
                        backgroundColor:
                            isUnplayedMatch
                                ? "none" // No background color if the match isn't played
                                : fixture.team2_score > fixture.team1_score
                                ? winnerColor
                                : loserColor
                    };

                    return (
                        <main key={fixture.game_id}>
                            {/* Team 1 Details */}
                            <div className="left-team" style={team1Style}>
                                <div>{fixture.team1_player1}</div>
                                <div>|</div>
                                <div>{fixture.team1_player2}</div>
                            </div>

                            {/* Show Scores or Edit Button */}
                            {visible && (
                                <>
                                    {isUnplayedMatch && isAdminRoute && !isEditing && (
                                        // Show Edit Button only if the match is unplayed
                                        <button onClick={() => setEditGameId(fixture.game_id)}>Edit</button>
                                    )}
                                    {!isUnplayedMatch && !isEditing && (
                                        // Show scores only if the match is played
                                        <div className="score-team">
                                            <div>{fixture.team1_score}</div>
                                            <div>{fixture.team2_score}</div>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Scoring Section */}
                            {isEditing && (
                                <div className="setScore">
                                    <input
                                        type="text"
                                        value={team1Score}
                                        onChange={e => setTeam1Score(e.target.value)}
                                        placeholder="Team 1 Score"
                                    />
                                    <button onClick={() => handleGame(fixture.game_id)}>Save</button>
                                    <input
                                        type="text"
                                        value={team2Score}
                                        onChange={e => setTeam2Score(e.target.value)}
                                        placeholder="Team 2 Score"
                                    />
                                </div>
                            )}

                            {/* Team 2 Details */}
                            <div className="right-team" style={team2Style}>
                                <div>{fixture.team2_player1}</div>
                                <div>|</div>
                                <div>{fixture.team2_player2}</div>
                            </div>
                        </main>
                    );
                })}
            </Modal>
        </div>
    );
}

export default Fixtures;

// FULLY FINISHED WAITING FOR THE DOUBLE CHECK