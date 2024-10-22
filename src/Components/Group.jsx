import React, { useEffect, useState, useCallback } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import GroupRow from "./Group_row";
import Fixtures from "./Fixtures";

function Group(props) {
    const [rows, setRows] = useState([]);

    const generateRows = useCallback(() => {
        const newRows = props.data.map((row) => (
            <GroupRow
                key={row.team_id} // Assuming team_id is unique
                rank={row.team_rank}
                player1={row.player1}
                player2={row.player2}
                played={row.team_played}
                wins={row.team_wins}
                losses={row.team_losses}
                points={row.team_point} // Adjust as per your data structure
            />
        ));
        setRows(newRows);
    }, [props.data]);

    useEffect(() => {
        generateRows();
    }, [generateRows]);

    return (
        <div className="Group">
            <GroupRow
                rank={"Rank"}
                player1={"Player 1"}
                player2={"Player 2"}
                played={"PL"}
                wins={"W"}
                losses={"L"}
                points={"Pts"}
            />
            {rows.length > 0 ? rows : "Loading..."}
            <Fixtures group_id={props.group_id} admin={'NO'} />
        </div>
    );
}

export default Group;
