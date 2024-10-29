import React from "react";
import Fixtures from "../Components/Fixtures";
import QuarterFinal from "../Components/QuarterFinal";
import SemiFinal from "../Components/SemiFinal";
import Final from "../Components/Final";
import { json } from "react-router-dom";

function Admin_Page(){

    const Restart = async() =>{
        try{
            const response = await fetch('http://13.61.73.123:5000/Terminate');
                if (response) {
                    alert(response.json);
                    }
               }
        catch(e){
                alert("Problem with DELETING " + e);
               }
    }


    return(
        <div className="admin-page">
            <Fixtures group_id={'A'} admin={'YES'}/>
            <Fixtures group_id={'B'} admin={'YES'}/>
            <Fixtures group_id={'C'} admin={'YES'}/>
            <Fixtures group_id={'D'} admin={'YES'}/>
            <QuarterFinal admin={'YES'}/>
            <SemiFinal admin={'YES'}/>
            <Final admin={'YES'}/>
            <div className="restart-btn">
                <button onClick={Restart}>Restart</button>
            </div>
        </div>
    );
}
export default Admin_Page