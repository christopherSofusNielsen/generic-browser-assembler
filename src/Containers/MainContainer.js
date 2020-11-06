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
      this.setState({ 
        raw: compiler.raw(),
        consoleValue:"Code successfully compiled!"
      });
      this.selectDisplay();
    }
  };

  selectDisplay = () => {
    const { displayMode, raw } = this.state;
    switch (displayMode) {
      case types.BINARY_MODE:
        return this.displayCode(raw, formatter.binaryFormatter);

      case types.BINARY_DEBUG_MODE:
        return this.displayCode(raw, formatter.binaryDebugFormatter);

      case types.CHISEL_MODE:
        return this.displayCode(raw, formatter.chiselFormatter);

      case types.CHISEL_DEBUG_MODE:
        return this.displayCode(raw, formatter.chiselDebugFormatter);

      default:
    }
  };

  displayCode = (raw, formatter) => {
    try {
     return { 
        compiledCode: formatter(raw),
       
     }
     
    } catch (error) {
      console.log(error);
      alert("Format error")
      return { 
        compiledCode: "",
     }
    }
  };

 

  render() {

    const {compiledCode, consoleValue}=this.selectDisplay()
    return (
      <Main
        onCodeInput={(e) => this.setState({ codeTxtValue: e.target.value })}
        onCompile={this.compileCode}
        onLoadExample={this.loadExample}
        onDisplayModeChange={this.onDisplayModeChange}
        displayMode={this.state.displayMode}
        codeTxtValue={this.state.codeTxtValue}
        compiledCode={compiledCode}
        consoleValue={this.state.consoleValue}
      />
    );
  }
}

export default MainContainer;
