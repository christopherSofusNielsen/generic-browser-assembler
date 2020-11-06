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
        addr: cnt,
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

export const joinParameters = (isaInstr, parametersB) => {
  let word = [];

  isaInstr.output.forEach((out) => {
    if (out.ref === "instr") {
      word.push(isaInstr.opcode);
    } else if (out.ref === "const") {
      word.push(out.value);
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

      if (Object.keys(out).length > 1) {
        let l = parametersB[index].length - 1;
        let subStr = parametersB[index].substring(l - out.msb, l - out.lsb + 1);
        word.push(subStr);
      } else {
        word.push(parametersB[index]);
      }
    }
  });

  let wordJoined = word.join("");

  return wordJoined;
};

// export const convertParameter = (isa, instr, parISA, par, labelTbl) => {
//   switch (parISA.type) {
//     case types.REG:
//       return findRegister(isa, par);

//     case types.UINT:
//       return toUint(parISA, par);

//     default:
//       throw new Error(
//         `No type assigned to instruction ${instr} in ISA-config file.`
//       );
//   }
// };

export const convertParameters = (isa, labelTbl, instr, row) => {
  let parsed = [];

  instr.input.forEach((input, no) => {
    let bits = "";
    switch (input.type) {
      case types.LABEL:
        bits = labelToBits(
          labelTbl,
          row.parameters[no],
          row.addr,
          input.size,
          input.relative
        );
        break;

      case types.REG:
        bits = findRegister(isa, row.parameters[no]);
        break;
      case types.UINT:
        bits = toUint(input.size, row.parameters[no]);
        break;
    }
    parsed.push(bits);
  });
  return parsed;
};

const labelToBits = (labelTbl, lbl, addr, size, relative) => {
  //check if label exist
  let lblAddr = labelTbl[lbl];
  let hardCoded=false;

  if (lblAddr === undefined) {
    //check if the label is hardcoded
    let parsedLbl = parseInt(lbl);
    if (isNaN(parsedLbl)) {
      throw new Error(`Label ${lbl}, does not exist in program`);
    }
    lblAddr = parsedLbl;
    hardCoded=true;
  }

  //convert label to address, based on relative
  if (relative && !hardCoded) {
    let ra = calcRelativeAddress(lblAddr, addr, size);
    let rab = signedIntToBit(ra, size);
    return rab;
  } else {
    let da = signedIntToBit(lblAddr, size);
    let dab = extend(size, da.toString(2));
    return dab;
  }
};

const calcRelativeAddress = (toAddr, fromAddr, size) => {
  let ta = parseInt(toAddr);
  let fa = parseInt(fromAddr);

  if (isNaN(ta) || isNaN(fa)) {
    throw new Error(`Error calculating relative address`);
  }

  let ra = ta - fa;

  if (ra > Math.pow(2, size - 1) - 1 || ra < -1 * Math.pow(2, size - 1)) {
    throw new Error(`Outside range: ${ra}`);
  }

  return ra;
};

const convertUint = (strVal, bitSize) => {
  let value = parseInt(strVal);
  if (isNaN(value)) {
    throw new Error(`Expected integer, got ${strVal}`);
  }
  if (value > Math.pow(2, bitSize) - 1 || value < 0) {
    throw new Error(`Outside range: ${value}`);
  }
  return value;
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

const toUint = (bitSize, strVal) => {
  let value = parseInt(strVal);
  //test if value are inside range
  if (value > Math.pow(2, bitSize) - 1 || value < 0) {
    throw new Error(`Outside range: ${value}`);
  }
  let bit = value.toString(2);
  bit = extend(bitSize, bit);
  return bit;
};

const signedIntToBit = (value, size) => {
  let bits = (value >>> 0).toString(2);

  let l = bits.length;
  if (l > size) {
    return bits.substring(l - size, l);
  } else {
    for (let i = 0; i < size; i++) {
      bits = "0" + bits;
    }
    return bits;
  }
};

const extend = (size, value) => {
  let n = size - value.length;

  for (let i = 0; i < n; i++) {
    value = "0" + value;
  }
  return value;
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
