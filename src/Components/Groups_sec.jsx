import React, { useEffect, useState, useMemo } from "react";
import Group from "./Group";
import "../css/home_page.css";

function Group_sec() {
    const [data, setData] = useState([]);
    const [fixtures, setFixtures] = useState([]);
    const [Loading,setLoading] = useState(true);

    
    const NumOfGroups = useMemo(() => {
        if (data.length <= 4) return 1;
        if (data.length <= 8) return 2;
        if (data.length <= 12) return 3;
        return 4;
    }, [data.length]);

    // Group the data and sort it in one pass
    const groups = useMemo(() => {
        const seq = ["A", "B", "C", "D"];
        const groupCount = NumOfGroups;
        const newGroups = [];

        for (let i = 0; i < groupCount; i++) {
            const groupData = data
                .filter(item => item.group === seq[i])
                .sort((a, b) => a.team_rank - b.team_rank);

            // Pass both group data and filtered fixtures to Group
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
                const response = await fetch("http://13.61.73.123:5000/GetData");
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
                alert("There was a problem fetching the data. Please try again.");
            }
        };

        const fetchFixtures = async () => {
            try {
                const response = await fetch("http://13.61.73.123:5000/GetFixtures");
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

    return <div className="group-sec">{Loading ? 'Loading' : groups}</div>;
}

export default Group_sec;

// FULLY FINISHED WAITING FOR THE DOUBLE CHECK
