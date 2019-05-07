import React, { Component } from "react";
import Button from "../Button";
import styled from "@emotion/styled";

import "./save.css";

const Modal = props => {
  function downloadClick() {
    let valid = saveCanvas(props);

    if (valid) props.close();
  }

  const ButtonGrid = styled.div`
    display: grid;
    grid-gap: 16px;
    grid-template-areas: "closeBtn saveBtn";
  `;

  const GridArea = styled.div`
    grid-area: ${props => props["area"]};
  `;

  return (
    <div
      className="modal-wrapper"
      style={{
        transform: props.show ? "translateY(0vh)" : "translateY(-100vh)",
        opacity: props.show ? "1" : "0"
      }}
    >
      <div className="modal-header">
        <h3>Save</h3>
        <span className="close-modal-btn" onClick={props.close}>
          x
        </span>
      </div>
      <div className="modal-body">
        <input id="fileName" type="text" name="file" placeholder="File Name" />
      </div>
      <div className="modal-footer">
        <ButtonGrid>
          <GridArea area="closeBtn">
            <Button
              variant="raised"
              className="btn-cancel"
              onClick={props.close}
            >
              CLOSE
            </Button>
          </GridArea>
          <GridArea area="saveBtn">
            <Button
              variant="raised"
              className="btn-download"
              onClick={downloadClick}
            >
              SAVE
            </Button>
          </GridArea>
        </ButtonGrid>
      </div>
    </div>
  );
};

function saveCanvas(props) {
  const fileName = document.getElementById("fileName").value;

  if (/^[a-z0-9_.@()-]+$/i.test(fileName)) {
    let mainComp = props.mainComp;
    let activeLayers = props.activeLayers;
    const data = { mainComp: mainComp, activeLayers: activeLayers };
    const string = JSON.stringify(data, null, 2);

    // create a blob object representing the data as a JSON string
    const file = new Blob([string], {
      type: "application/json"
    });

    // trigger a click event on an <a> tag to open the file explorer
    const a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = fileName + ".json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return true;
  } else {
    alert("Invalid file name!");
    return false;
  }
}

class Save extends Component {
  constructor(props) {
    super();

    this.state = {
      isShowing: false
    };

    this.mainComp = props.mainComp;
    this.activeLayers = props.activeLayers;
  }

  openModal = () => {
    this.setState({
      isShowing: true
    });
  };

  closeModal = () => {
    this.setState({
      isShowing: false
    });
  };

  render() {
    return (
      <span className="saveSpan">
        {this.state.isShowing ? (
          <div onClick={this.closeModal} className="back-drop" />
        ) : null}
        <Button
          variant="raised"
          className="open-modal-btn"
          onClick={this.openModal}
        >
          Save
        </Button>
        {this.state.isShowing ? (
          <Modal
            className="modal"
            show={this.state.isShowing}
            close={this.closeModal}
            mainComp={this.mainComp}
            activeLayers={this.activeLayers}
          />
        ) : null}
      </span>
    );
  }
}

export default Save;
