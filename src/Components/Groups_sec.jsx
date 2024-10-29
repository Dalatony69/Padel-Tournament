import React, { useEffect, useState, useCallback } from "react";
import Group from "./Group";
import '../css/home_page.css';

function Group_sec() {
    const [data, setData] = useState([]);
    const [groups, setGroups] = useState([]);

    const NumOfGroups = useCallback(() => {
        if (data.length <= 4) return 1;
        if (data.length <= 8) return 2;
        if (data.length <= 12) return 3;
        return 4;
    }, [data.length]);

    const updateGroups = useCallback(() => {
        const seq = ['A', 'B', 'C', 'D'];
        const groupCount = NumOfGroups();
        const newGroups = [];

        for (let i = 0; i < groupCount; i++) {
            const groupData = data.filter(item => item.group === seq[i]);
            groupData.sort((a, b) => a.team_rank - b.team_rank);
            newGroups.push(
                <Group key={seq[i]} data={groupData} group_id={seq[i]} />
            );
        }

        setGroups(newGroups);
    }, [data, NumOfGroups]);

    useEffect(() => {
        const GetData = async () => {
            try {
                const response = await fetch('http://13.61.73.123:5000/GetData');
                if (!response.ok) throw new Error('Network response was not ok');

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

        GetData();
    }, []);

    useEffect(() => {
        if (data.length > 0) {
            updateGroups();
        }
    }, [data, updateGroups]);

    return (
        <div className="group-sec">
            {groups}
        </div>
    );
}

export default Group_sec;
