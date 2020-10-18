import React, { Component } from "react";

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
    };
  }

  loadExample = () => {
    this.setState({ codeTxtValue: example });
  };

  compileCode = () => {
    let isa = this.state.defaultIsa;
    let compiler = new Compiler(isa, this.state.codeTxtValue);
    compiler.compile();
    console.log(compiler.raw());

    this.setState({ compiledCode: "Compiled" });
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
