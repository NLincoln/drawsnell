import React, { Component } from 'react';

class ImportImage extends Component {
    clickInput() {
        document.getElementById('file').click();
    }

    importImage() {
        var file = document.getElementById('file')
        var fr = new FileReader();
        fr.onload = onFileReaderLoad;
        fr.readAsDataURL(file.files[0]);
    }
    
    render() {
        return (
            <div>
                <button onClick={this.clickInput}>Open File</button>
                <input type="file" id="file" ref="fileUpload" onChange={this.importImage} style={{display:"none"}}></input>
            </div>
        );
    }
}

function onFileReaderLoad(e) {
    var context = document.getElementById('canvas').getContext('2d');
    var urlStyle = e.target.result;
    var image = new Image();
    image.onload = function() {
        context.drawImage(image, 0, 0);
    }
    image.src = urlStyle;
}

export default ImportImage;