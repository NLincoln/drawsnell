import React from "react";
import ReactDOM from "react-dom";
import "typeface-roboto";

import JssProvider from "react-jss/lib/JssProvider";
import { create } from "jss";
import { createGenerateClassName, jssPreset } from "@material-ui/core/styles";

const generateClassName = createGenerateClassName();
const jss = create(jssPreset());
jss.options.insertionPoint = document.getElementById("jss-insertion-point");

function ProperJssProvider(props) {
  return <JssProvider jss={jss} generateClassName={generateClassName} {...props} />;
}

function render() {
  let App = require("./app").default;
  ReactDOM.render(
    <ProperJssProvider>
      <App />
    </ProperJssProvider>,
    document.getElementById("root")
  );
}

render();
/**
 * Nate, what the heck am I looking at, you ask?
 *
 * this is a fancy-pants feature of webpack called hot module reloading.
 * Webpack is the thing that actually builds the files under the hood into
 * what the browser sees. Normally when webpack detects a change it reloads
 * the entire page. That's fine, but man what if we could just tell webpack
 * not to do that, and instead let us handle the process of updating the page
 * after code changes?
 *
 * That is exactly what this does. Every time App.js _or any file it imports_ (which is like all of them)
 * changes, webpack will call this function to reload the page. In this function, all we're doing
 * is
 * 1. remove the old code on the page
 * 2. render the new code
 *
 * This is the reason for the require('./App').default above. We can't use import because import is static and won't
 * be able to get us the new files. require will. Buttt because App uses `export default`, we have to grab the default
 * export
 */
if (module.hot) {
  module.hot.accept("./app", () => {
    ReactDOM.unmountComponentAtNode(document.getElementById("root"));
    render();
  });
}
