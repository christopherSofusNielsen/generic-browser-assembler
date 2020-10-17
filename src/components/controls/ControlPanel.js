import React from "react";

const ControlPanel = (props) => (
  <div>
    <button onClick={props.onCompile}>Compile</button>
  </div>
);

export default ControlPanel;
