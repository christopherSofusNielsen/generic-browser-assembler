import React from "react";

import classes from "./textArea.module.css";

//https://www.npmjs.com/package/react-ace

const CodeTextArea = (props) => (
  <div className={classes.container}>
    <textarea
      className={classes.codeTextArea}
      onInput={props.onInput}
      onChange={(e) => {}}
      value={props.value}
    ></textarea>
  </div>
);

export default CodeTextArea;
