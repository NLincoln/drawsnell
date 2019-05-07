import React from "../../node_modules/react";
import "./import.css";
import Button from "@material-ui/core/Button";

function clickInput() {
  document.getElementById("file").click();
}

export default function ImportImage(props) {
  function importImage() {
    let file = document.getElementById("file");
    let fr = new FileReader();
    fr.onload = function(e) {
      let urlStyle = e.target.result;
      let image = new Image();
      image.onload = function() {
        let canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, image.width, image.height);

        for (let x = 0; x < props.mainComp.layers[0].width; x++) {
          for (let y = 0; y < props.mainComp.layers[0].height; y++) {
            for (let i = 0; i < props.activeLayers.length; i++) {
              let idx = props.activeLayers[i];
              let data = ctx.getImageData(x, y, 1, 1).data;
              props.mainComp.layers[idx].pixelData[x][y].r = data[0];
              props.mainComp.layers[idx].pixelData[x][y].g = data[1];
              props.mainComp.layers[idx].pixelData[x][y].b = data[2];
              props.mainComp.layers[idx].pixelData[x][y].a = data[3];
            }

            if (y + 1 > image.height) {
              break;
            }
          }

          if (x + 1 > image.width) {
            break;
          }
        }
        props.changeOneTimeEvent("redrawCanvas");
      };
      image.src = urlStyle;
    };
    if (file !== null) {
      fr.readAsDataURL(file.files[0]);
    }
  }

  return (
    <span classname="imageSpan">
      <Button variant="raised" className="import-btn" onClick={clickInput}>
        Open File
      </Button>
      <input
        type="file"
        id="file"
        onChange={importImage}
        style={{ display: "none" }}
      />
    </span>
  );
}
