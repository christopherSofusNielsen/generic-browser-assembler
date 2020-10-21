import * as types from "../assets/constants";
import * as util from "./utilities";

const instructSize = 1;

class Compiler {
  constructor(isa, txt) {
    this.state = {
      txt,
      isa,
      consoleOut: [],
      compiled: [],
    };
  }

  add2Console = (type, line, msg) => {
    let txt = `Line ${line}: ${msg}`;

    this.state.consoleOut.push(txt);
  };

  preCompile = () => {
    try {
      let cleanCode = util.removeComments(this.state.txt);
      let pc = util.createlabelTable(cleanCode, instructSize);

      this.state.preCompiled = pc.code;
      this.state.labelTbl = pc.tbl;
    } catch (error) {
      this.add2Console(types.ERROR, "XX", "Error precompiling code!");
    }
  };

  assemble = () => {
    let compiled = [];

    //go through each instruction
    this.state.preCompiled.forEach((o) => {
      try {
        //find instr in ISA
        let instrISA = util.findInstr(o.instr, this.state.isa.instrs);

        //check parameters
        if (instrISA.input.length !== o.parameters.length) {
          throw new Error(
            `${o.instr} needs ${instrISA.input.length} arguments`
          );
        }

        //convert parameters
        let parametersB = [];
        for (let i = 0; i < instrISA.input.length; i++) {
          let res = util.convertParameter(
            this.state.isa,
            instrISA.mnemonic,
            instrISA.input[i],
            o.parameters[i]
          );
          parametersB[i] = res;
        }

        //Get opcode
        if (!instrISA.opcode) {
          throw new Error(`Opcode for ${instrISA.mnemonic} is not defined.`);
        }

        //join the bit representations
        let word = util.joinParameters(instrISA, parametersB);

        if (word.length !== this.state.isa.wordSize) {
          throw new Error(
            `Size of compiled instruction, does not match with wordsize.`
          );
        }

        compiled.push({
          line: o.line,
          word,
        });
      } catch (error) {
        this.add2Console(types.ERROR, o.line, error);
      }
    });
    console.log(compiled);
    this.state.compiled = compiled;
  };

  compile = () => {
    this.preCompile();
    this.assemble();

    return this.state.consoleOut.length === 0;
  };

  raw = () => {
    return this.state.compiled;
  };

  consoleOut = () => {
    return this.state.consoleOut;
  };
}

export default Compiler;
