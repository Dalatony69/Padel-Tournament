import React from "react";
import QuarterFinal from "./QuarterFinal";
import SemiFinal from "./SemiFinal";
import Final from "./Final";

function Knockout_sec(){


    return(
        <div className="knockout-sec">
            <div className="holderrr">
                <QuarterFinal/>
                <div className="line-holder1-1">
                    <div>1</div>
                    <div className="left">2</div>
                    <div className="right">3</div>
                    <div>4</div>
                    <div>5</div>
                    <div className="left">6</div>
                    <div className="right">7</div>
                    <div>8</div>
                </div>
                <div className="line-holder1-2">
                    <div>1</div>
                    <div>2</div>
                    <div className="left">3</div>
                    <div>4</div>
                    <div>5</div>
                    <div>6</div>
                    <div className="left">7</div>
                    <div>8</div>
                </div>
                <SemiFinal/>
                <div className="line-holder2-1">
                    <div>1</div>
                    <div className="left">2</div>
                    <div className="right">3</div>
                    <div>4</div>
                </div>
                <div className="line-holder2-2">
                    <div>1</div>
                    <div>2</div>
                    <div className="left">3</div>
                    <div>4</div>
                </div>
                <Final/>
            </div>
        </div>
    );
}

export default Knockout_sec;