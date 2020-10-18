import React from "react";

import classes from "./textArea.module.css";

const StaticTextArea = (props) => (
  <div className={classes.container}>
    <textarea
      className={classes.staticTextArea}
      value={props.value}
      readOnly={true}
    ></textarea>
  </div>
);

export default StaticTextArea;
