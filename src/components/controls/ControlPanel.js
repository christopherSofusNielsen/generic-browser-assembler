import * as types from "../../assets/constants";

import React from "react";

const ControlPanel = (props) => (
  <div>
    <button onClick={props.onCompile}>Compile</button>
    <button onClick={props.onLoadExample}>Load example</button>
    <select value={props.displayMode} onChange={props.onDisplayModeChange}>
      <option value={types.BINARY_MODE}>Binary</option>
      <option value={types.BINARY_DEBUG_MODE}>Debug</option>
    </select>
  </div>
);

export default ControlPanel;
