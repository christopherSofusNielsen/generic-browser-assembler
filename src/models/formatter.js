export const binaryFormatter = (raw) => {
  let txt = raw.map((o) => {
    let w = [];
    w.push(o.word.substring(0, 8));
    w.push(o.word.substring(8, 16));
    w.push(o.word.substring(16, 24));
    w.push(o.word.substring(24));
    return w.join("-");
  });
  return txt.join("\n");
};

export const binaryDebugFormatter = (raw) => {
  let txt = [];
  let cnt = 0;

  raw.forEach((o) => {
    while (o.line > cnt) {
      txt.push(" ");
      cnt++;
    }

    let w = [];
    w.push(o.word.substring(0, 8));
    w.push(o.word.substring(8, 16));
    w.push(o.word.substring(16, 24));
    w.push(o.word.substring(24));
    txt.push(w.join("-"));
    cnt++;
  });

  return txt.join("\n");
};

export const chiselFormatter = (raw) => {
  let txt = raw.map((o) => {
    let w = [];
    w.push('"b');
    w.push(o.word.substring(0, 4));
    w.push("_");
    w.push(o.word.substring(4, 8));
    w.push("_");
    w.push(o.word.substring(8, 12));
    w.push("_");
    w.push(o.word.substring(12, 16));
    w.push("_");
    w.push(o.word.substring(16));
    w.push('".U(32.W),');
    return w.join("");
  });
  return txt.join("\n");
};

export const chiselDebugFormatter = (raw) => {
  let txt = [];
  let cnt = 0;

  raw.forEach((o) => {
    while (o.line > cnt) {
      txt.push(" ");
      cnt++;
    }

    let w = [];
    w.push('"b');
    w.push(o.word.substring(0, 4));
    w.push("_");
    w.push(o.word.substring(4, 8));
    w.push("_");
    w.push(o.word.substring(8, 12));
    w.push("_");
    w.push(o.word.substring(12, 16));
    w.push("_");
    w.push(o.word.substring(16));
    w.push('".U(32.W),');
    txt.push(w.join(""));
    cnt++;
  });

  return txt.join("\n");
};
