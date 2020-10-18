import * as types from "../assets/constants";

const instructSize = 1;

class Compiler {
  constructor(isa, txt) {
    this.state = {
      txt,
      isa,
    };
  }

  preCompile = () => {
    // split into rows based on \n
    let rows = this.state.txt.split("\n");
    let compiled = [];

    //convert each row to object with line number
    rows.forEach((r, i) => {
      let rTrim = r.trim();

      //remove comments & empty lines
      if (rTrim.length === 0 || rTrim.charAt(0) === "/") {
        return;
      }

      let type = rTrim.charAt(0) === "#" ? types.LABEL : types.INSTR;

      let rClean;
      if (type === types.LABEL) {
        rTrim = rTrim.split("/")[0];
        rClean = rTrim.split(" ")[0];
      } else {
        rClean = rTrim.split(";")[0];
      }

      rClean = rClean.trim();

      compiled.push({
        line: i,
        row: rClean,
        type,
      });
    });

    this.state.precompiled = compiled;
  };

  //wont work
  createLabelTable = () => {
    let tbl = {};

    this.state.precompiled.forEach((o, i) => {
      if (o.type !== types.LABEL) return;

      let lbl = o.row.substring(1);

      tbl[lbl] = (i + 1) * instructSize;
    });

    this.state.labelTbl = tbl;
  };

  assemble = () => {};

  compile = () => {
    this.preCompile();
    console.log(this.state.precompiled);
  };

  raw = () => {
    return "none";
  };
}

export default Compiler;
