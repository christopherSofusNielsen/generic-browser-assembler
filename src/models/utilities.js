import * as types from "../assets/constants";

export const removeComments = (txt) => {
  // split into rows based on \n
  let rows = txt.split("\n");
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

  return compiled;
};

export const createlabelTable = (code, instructSize) => {
  let tbl = {};
  let preCompiledCode = [];
  let cnt = 0;
  code.forEach((o) => {
    if (o.type !== types.LABEL) {
      let splittedRow = splitRow(o.row);
      preCompiledCode.push({
        ...o,
        ...splittedRow,
      });
      cnt++;
      return;
    }

    let lbl = o.row.substring(1);

    tbl[lbl] = cnt * instructSize;
  });

  return {
    tbl,
    code: preCompiledCode,
  };
};

export const findInstr = (instr, isaInstr) => {
  let index = isaInstr.findIndex((ins) => {
    return ins.mnemonic === instr;
  });

  if (index === -1) {
    throw new Error(`${instr}, does not exist in ISA`);
  }

  return isaInstr[index];
};

export const convertParameter = (isa, instr, parISA, par) => {
  switch (parISA.type) {
    case types.REG:
      //its a register, make sure it exist
      return findRegister(isa, par);

    default:
      throw new Error(
        `No type assigned to instruction ${instr} in ISA-config file.`
      );
  }
};

export const joinParameters = (isaInstr, parametersB) => {
  let word = [];

  isaInstr.output.forEach((out) => {
    if (out.ref === "instr") {
      word.push(isaInstr.opcode);
    } else {
      //ref must be in input
      let index = isaInstr.input.findIndex((inp) => {
        return inp.name === out.ref;
      });

      if (index === -1) {
        throw new Error(
          `ref not defined in input for instruction: ${isaInstr.mnemonic}`
        );
      }

      let info = isaInstr.input[index];

      if (Object.keys(info) > 1) {
      } else {
        word.push(parametersB[index]);
      }
    }
  });

  let wordJoined = word.join("");

  return wordJoined;
};

const findRegister = (isa, reg) => {
  if (!isa.regs) {
    throw new Error("No regs asigned to ISA-config file");
  }

  let index = isa.regs.findIndex((r) => {
    return r.name === reg;
  });

  if (index === -1) {
    throw new Error(`Register ${reg} does not exist in ISA-config file`);
  }

  return isa.regs[index].out;
};

const splitRow = (row) => {
  const firstSpace = row.indexOf(" ");
  //instr
  let instr = row.substring(0, firstSpace);

  //parameters
  let parameters = row.substring(firstSpace).split(",");
  parameters = parameters.map((p) => {
    return p.trim();
  });
  return {
    instr,
    parameters,
  };
};
