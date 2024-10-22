import React from "react";
import Header from "../Components/Header";
import GroupSec from "../Components/Groups_sec";
import KnockoutSec from "../Components/Knockout_sec";
import "../App2.css";

function Home_page(){

    return(
        <div className="Home-page">
            <Header/>
            <GroupSec/>
            <KnockoutSec/>
        </div>
    );
}
export default Home_page;