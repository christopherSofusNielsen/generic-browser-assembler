import React from "react";
import ControlPanel from "../controls/ControlPanel";
import CodeTextArea from "../textareas/CodeTextArea";
import StaticTextArea from "../textareas/StaticTextArea";

import classes from "./main.module.css";

const Main = (props) => (
  <div className={classes.container}>
    <h1>Browser assembler</h1>
    <div>
      <ControlPanel onCompile={props.onCompile} />
    </div>
    <div className={classes.frames}>
      <CodeTextArea value={props.codeTxtValue} onInput={props.onCodeInput} />
      <StaticTextArea value={props.compiledCode} />
    </div>
    <div className={classes.console}>
      <h2>Console</h2>
      <StaticTextArea value={props.consoleValue} />
    </div>
  </div>
);

export default Main;
