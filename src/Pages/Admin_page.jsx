import React from "react";
import Fixtures from "../Components/Fixtures";
import QuarterFinal from "../Components/QuarterFinal";
import SemiFinal from "../Components/SemiFinal";
import Final from "../Components/Final";

function Admin_Page(){



    return(
        <div className="admin-page">
            <Fixtures group_id={'A'} admin={'YES'}/>
            <Fixtures group_id={'B'} admin={'YES'}/>
            <Fixtures group_id={'C'} admin={'YES'}/>
            <Fixtures group_id={'D'} admin={'YES'}/>
            <QuarterFinal admin={'YES'}/>
            <SemiFinal admin={'YES'}/>
            <Final admin={'YES'}/>
        </div>
    );
}
export default Admin_Page