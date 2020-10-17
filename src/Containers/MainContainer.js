import React, { Component } from "react";

import Main from "../components/main/Main";

class MainContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      codeTxtValue: "",
      compiledCode: "",
      consoleValue: "",
    };
  }

  compileCode = () => {
    this.setState({ compiledCode: "Compiled" });
  };

  render() {
    return (
      <Main
        onCodeInput={(e) => this.setState({ codeTxtValue: e.target.value })}
        onCompile={this.compileCode}
        codeTxtValue={this.state.codeTxtValue}
        compiledCode={this.state.compiledCode}
        consoleValue={this.state.consoleValue}
      />
    );
  }
}

export default MainContainer;
