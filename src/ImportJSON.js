import React, { Component } from 'react';

class ImportJSON extends Component {
    constructor(props) {
        super();

        this.mainComp = props.mainComp;
        this.activeLayers = props.activeLayers;
        this.changeMainComp = props.changeMainComp;
        this.changeActiveLayers = props.changeActiveLayers;
    }
    
    clickInput() {
        document.getElementById('jsonfile').click();
    }

    importJSON = () => {
        var file = document.getElementById('jsonfile')
        let fr = new FileReader();
        fr.onload = function(e) {
            let jsonText = e.target.result;
            let obj = JSON.parse(jsonText);
            this.mainComp = obj.mainComp;
            this.activeLayers = obj.activeLayers;
        };
        fr.readAsText(file.files[0]);
    }
    
    render() {
        return (
            <div>
                <button onClick={this.clickInput}>Open JSON</button>
                <input type="file" id="jsonfile" ref="jsonfileUpload" onChange={this.importJSON} style={{display:"none"}}></input>
            </div>
        );
    }
}


export default ImportJSON;