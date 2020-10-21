export const binaryFormatter = (raw) => {
  let txt = raw.map((o) => {
    let w = [];
    w.push(o.word.substring(0, 7));
    w.push(o.word.substring(8, 15));
    w.push(o.word.substring(16, 23));
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
    w.push(o.word.substring(0, 7));
    w.push(o.word.substring(8, 15));
    w.push(o.word.substring(16, 23));
    w.push(o.word.substring(24));
    txt.push(w.join("-"));
    cnt++;
  });

  return txt.join("\n");
};