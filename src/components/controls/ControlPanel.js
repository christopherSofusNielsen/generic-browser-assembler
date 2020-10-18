import React from "react";

const ControlPanel = (props) => (
  <div>
    <button onClick={props.onCompile}>Compile</button>
    <button onClick={props.onLoadExample}>Load example</button>
  </div>
);

export default ControlPanel;
