import React, { Component } from 'react';

import './Save.css';

const Modal = (props) => {
    function downloadClick() {
        let valid = saveCanvas(props);

        if (valid)
            props.close();
    }

    return (
        <div className="modal-wrapper"
            style={{
                transform: props.show ? 'translateY(0vh)' : 'translateY(-100vh)',
                opacity: props.show ? '1' : '0'
            }}>
            <div className="modal-header">
                <h3>Save</h3>
                <span className="close-modal-btn" onClick={props.close}>x</span>
            </div>
            <div className="modal-body">
                <input id="fileName" type="text" name="file" placeholder="File Name"></input>
            </div>
            <div className="modal-footer">
                <button className="btn-cancel" onClick={props.close}>CLOSE</button>
                <button className="btn-download" onClick={downloadClick}>SAVE</button>
            </div>
        </div >
    )
}

function saveCanvas(props) {
    const fileName = document.getElementById('fileName').value;

    if (/^[a-z0-9_.@()-]+$/i.test(fileName)) {
        const canvas = document.getElementById('canvas');
        const canvasContents = canvas.toDataURL(); // a data URL of the current canvas image
        const data = { image: canvasContents, date: Date.now() };
        const string = JSON.stringify(data);

        // create a blob object representing the data as a JSON string
        const file = new Blob([string], {
            type: 'application/json'
        });

        // trigger a click event on an <a> tag to open the file explorer
        const a = document.createElement('a');
        a.href = URL.createObjectURL(file);
        a.download = fileName + '.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return true;
    } else {
        alert('Invalid file name!');
        return false;
    }
}

class Save extends Component {
    constructor(props) {
        super();

        this.state = {
            isShowing: false
        }

        this.mainComp = props.mainComp;
        this.activeLayers = props.activeLayers;
    }

    openModal = () => {
        this.setState({
            isShowing: true
        });
    }

    closeModal = () => {
        this.setState({
            isShowing: false
        });
    }

    render() {
        return (
            <span>
                {this.state.isShowing ? <div onClick={this.closeModal} className="back-drop"></div> : null}
                <button className="open-modal-btn" onClick={this.openModal}>Save</button>
                {this.state.isShowing ?
                    <Modal
                        className="modal"
                        show={this.state.isShowing}
                        close={this.closeModal}
                        mainComp={this.mainComp}
                        activeLayers={this.activeLayers}
                    />
                    : null}
            </span>
        );
    }
}

export default Save;
