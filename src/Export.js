import React, { Component } from 'react';
import download from 'downloadjs';
import styled from "@emotion/styled";

import './Export.css';

const Grid = styled.div`
  display: grid;
  grid-gap: 16px;
  grid-template-areas:
    "fileName fileType";
`;

const GridArea = styled.div`
  grid-area: ${props => props["area"]};
`;

const Modal = (props) => {
    function downloadClick() {
        let valid = exportCanvas();

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
                <h3>Export</h3>
                <span className="close-modal-btn" onClick={props.close}>x</span>
            </div>
            <div className="modal-body">
                <Grid>
                    <GridArea area={"fileName"}>
                        <input id="fileName" type="text" name="file" placeholder="File Name"></input>
                    </GridArea>
                    <GridArea area={"fileType"}>
                        <select id="fileType">
                            <option value="png">PNG</option>
                            <option value="jpg">JPG</option>
                        </select>
                    </GridArea>
                </Grid>
            </div>
            <div className="modal-footer">
                <button className="btn-cancel" onClick={props.close}>CLOSE</button>
                <button className="btn-download" onClick={downloadClick}>DOWNLOAD</button>
            </div>
        </div >
    )
}

function exportCanvas() {
    const fileName = document.getElementById('fileName').value;
    const fileType = document.getElementById('fileType').value;

    if (/^[a-z0-9_.@()-]+$/i.test(fileName)) {
        let canvas = document.getElementById('canvas');
        const d = canvas.toDataURL();
        download(d, fileName + '.' + fileType);
        return true;
    } else {
        alert('Invalid file name!');
        return false;
    }
}

class Export extends Component {
    constructor() {
        super();

        this.state = {
            isShowing: false
        }
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
                <button className="open-modal-btn" onClick={this.openModal} > Export</button>
                {this.state.isShowing ?
                    <Modal
                        className="modal"
                        show={this.state.isShowing}
                        close={this.closeModal}
                    />
                    : null
                }
            </span>
        );
    }
}

export default Export;
