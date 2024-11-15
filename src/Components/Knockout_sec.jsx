import React from "react";
import QuarterFinal from "./QuarterFinal";
import SemiFinal from "./SemiFinal";
import Final from "./Final";

function Knockout_sec(){


    return(
        <div className="knockout-sec">
            <div className="holderrr">
                <QuarterFinal/>
                
                <SemiFinal/>

                <Final/>
            </div>
        </div>
    );
}

export default Knockout_sec;