import React from 'react';
import Composition from "./layers";
import './Import.css';

function clickInput() {
    document.getElementById('jsonfunc').click();
}

export default function ImportJSONF(props) {
    function ImportJSON(){
        var file = document.getElementById('jsonfunc')
        let fr = new FileReader();
        fr.onload = function(e) {
            let jsonText = e.target.result;
            let obj = JSON.parse(jsonText);
            let newComp = new Composition(obj.mainComp.width, obj.mainComp.height, obj.mainComp.layers);
            props.changeMainComp(newComp);
            props.changeActiveLayers(obj.activeLayers);
            props.changeOneTimeEvent("redrawCanvas");
        };
        if(file !== null){
            fr.readAsText(file.files[0]);
        }
    }

    return (
        <span>
            <button className="import-btn" onClick={clickInput}>Import JSON</button>
            <input type="file" id="jsonfunc" onChange={ImportJSON} style={{display:"none"}}></input>
        </span>
    );
};