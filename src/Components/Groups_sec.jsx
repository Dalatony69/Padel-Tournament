import React, { useEffect, useState, useMemo } from "react";
import Group from "./Group";
import "../css/home_page.css";
import { dotPulse } from 'ldrs';
import io from 'socket.io-client';

function Group_sec() {
    const [data, setData] = useState([]);
    const [fixtures, setFixtures] = useState([]);
    const [loading, setLoading] = useState(true);  // Changed to a boolean flag
    dotPulse.register();
    const socket = io('http://127.0.0.1:5000');

    const NumOfGroups = useMemo(() => {
        if (data.length <= 4) return 1;
        if (data.length <= 8) return 2;
        if (data.length <= 12) return 3;
        return 4;
    }, [data.length]);

    const groups = useMemo(() => {
        const seq = ["A", "B", "C", "D"];
        const groupCount = NumOfGroups;
        const newGroups = [];
    
        for (let i = 0; i < groupCount; i++) {
            const groupData = data
                .filter(item => item.group === seq[i])
                .sort((a, b) => a.team_rank - b.team_rank); // Sorting ensures arrangement by rank
    
            newGroups.push(
                <Group
                    key={seq[i]}
                    data={groupData}
                    group_id={seq[i]}
                    fixtures={fixtures.filter(f => f.game_stage === `Group ${seq[i]}`)}
                />
            );
        }
        return newGroups;
    }, [data, fixtures, NumOfGroups]);
    

    // Fetch data on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/GetData");
                if (!response.ok) throw new Error("Network response was not ok");

                const jsonData = await response.json();
                const formattedData = jsonData.map(row => ({
                    team_id: row[0],
                    player1: row[1],
                    player2: row[2],
                    group: row[3],
                    team_current: row[4],
                    team_played: row[5],
                    team_wins: row[6],
                    team_losses: row[7],
                    team_gd: row[8],
                    team_point: row[9],
                    team_rank: row[10]
                }));

                setData(formattedData);
            } catch (e) {
                console.error("Error fetching data:", e);
            }
        };

        const fetchFixtures = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/GetFixtures");
                if (!response.ok) throw new Error("Failed to fetch fixtures");
                const jsonData = await response.json();

                const formattedData = jsonData.map(row => ({
                    game_id: row.game_id,
                    team1_player1: row.team1_player1,
                    team1_player2: row.team1_player2,
                    team1_score: row.team1_score,
                    team2_player1: row.team2_player1,
                    team2_player2: row.team2_player2,
                    team2_score: row.team2_score,
                    game_stage: row.game_stage
                }));

                setFixtures(formattedData);
            } catch (error) {
                console.error("Error fetching fixtures:", error);
            }
            setLoading(false);
        };

        fetchData();
        fetchFixtures();
    }, []);

    useEffect(() => {
        socket.on('score_updated', (updatedTeams) => {
            const updatedTeamsMap = updatedTeams.reduce((map, team) => {
                map[team.team_id] = team;
                return map;
            }, {});
    
            setData(prevData => 
                prevData.map(team => {
                    const updatedTeam = updatedTeamsMap[team.team_id];
                    if (updatedTeam) {
                        // Make sure all properties, including `team_rank`, are updated
                        return {
                            ...team,
                            team_point: updatedTeam.team_point,
                            team_wins: updatedTeam.team_wins,
                            team_losses: updatedTeam.team_losses,
                            team_played: updatedTeam.team_played,
                        };
                    }
                    return team; // If no update, keep the original team
                })
            );
        });
    
        // Cleanup on unmount
        return () => {
            socket.off('score_updated');
        };
    }, []);

    useEffect(() => {
        socket.on('group_ranking_updated', (data) => {
            const { group_id, updated_ranks } = data;
    
            // Update the ranks in the data state
            setData(prevData => {
                return prevData.map(team => {
                    // If the team is in the updated group
                    if (team.group === group_id) {
                        const updatedTeamRank = updated_ranks.find(updated => updated.team_id === team.team_id);
                        if (updatedTeamRank) {
                            return {
                                ...team,
                                team_rank: updatedTeamRank.team_rank // Update only the rank
                            };
                        }
                    }
                    return team;
                });
            });
        });
    
        // Cleanup on unmount
        return () => {
            socket.off('group_ranking_updated');
        };
    }, []);
    
    

    return <div className="group-sec">{loading ? <l-dot-pulse size="43" speed="1.3" color="black"></l-dot-pulse> : groups}</div>;
}

export default Group_sec;
