import React, { Component } from 'react';

class ImportJSON extends Component {
    clickInput() {
        document.getElementById('jsonfile').click();
    }

    importJSON() {
        var file = document.getElementById('jsonfile')
        var fr = new FileReader();
        fr.onload = onFileReaderLoad;
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

function onFileReaderLoad(e) {
    var urlStyle = e.target.result;
    alert(urlStyle);
}

export default ImportJSON;