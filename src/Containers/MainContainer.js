import React, { Component } from "react";

//other
import * as types from "../assets/constants";
import * as formatter from "../models/formatter";

//data
import defaultISA from "../assets/default-isa.json";
import example from "../assets/example";

//models
import Compiler from "../models/Compiler";

//Components
import Main from "../components/main/Main";

class MainContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultIsa: defaultISA,
      codeTxtValue: "",
      compiledCode: "",
      consoleValue: "",
      displayMode: types.BINARY_DEBUG_MODE,
      raw: [],
    };
  }

  onDisplayModeChange = (e) => {
    this.setState({ displayMode: e.target.value });
    this.selectDisplay();
  };

  arrayToText = (arr) => {
    return arr.join("\n");
  };

  loadExample = () => {
    this.setState({ codeTxtValue: example });
  };

  compileCode = () => {
    let isa = this.state.defaultIsa;
    let compiler = new Compiler(isa, this.state.codeTxtValue);
    if (!compiler.compile()) {
      this.setState({ consoleValue: this.arrayToText(compiler.consoleOut()) });
    } else {
      this.setState({ raw: compiler.raw() });
      this.selectDisplay();
    }
  };

  selectDisplay = () => {
    const { displayMode, raw } = this.state;
    switch (displayMode) {
      case types.BINARY_MODE:
        this.displayCode(raw, formatter.binaryFormatter);
        break;

      case types.BINARY_DEBUG_MODE:
        this.displayCode(raw, formatter.binaryDebugFormatter);
        break;

      default:
    }
  };

  displayCode = (raw, formatter) => {
    try {
      this.setState({ compiledCode: formatter(raw) });
      this.setState({ consoleValue: "Code successfully compiled!" });
    } catch (error) {
      console.log(error);
      this.setState({
        compileCode: "",
        consoleValue: `An error occured formatting compiled code!`,
      });
    }
  };

  render() {
    return (
      <Main
        onCodeInput={(e) => this.setState({ codeTxtValue: e.target.value })}
        onCompile={this.compileCode}
        onLoadExample={this.loadExample}
        codeTxtValue={this.state.codeTxtValue}
        compiledCode={this.state.compiledCode}
        consoleValue={this.state.consoleValue}
      />
    );
  }
}

export default MainContainer;
