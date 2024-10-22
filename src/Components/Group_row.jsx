import React from "react";

function Group_row(props){

    return(
        <div className="Group-row">                   
            <div className="rank">{props.rank}</div>
            <div className="player1 name">{props.player1}</div>
            <div className="player2 name">{props.player2}</div>
            <div className="played">{props.played}</div>
            <div className="wins">{props.wins}</div>
            <div className="losses">{props.losses}</div>
            <div className="points">{props.points}</div>
        </div>
    );
}
export default Group_row;