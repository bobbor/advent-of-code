const memo = (() => {
  const cache = {};
  return (id, fn) => {
    const f = (...args) => {
      const flatArgs = args.map(JSON.stringify).join(",");
      const k = `${id}:${flatArgs}`;
      if (k in cache) {
        return cache[k];
      }
      cache[k] = fn(...args);
      return cache[k];
    };
    f.id = id;
    return f;
  };
})();

const humanTime = (ts, opts) => {
  const { ms, s, m, h, padded } = Object.assign(
    { ms: false, s: true, m: true, h: false, padded: true },
    opts
  );
  const v = Math.round(ts);
  const milliseconds = v % 1000;
  const sv = (v - milliseconds) / 1000;
  const seconds = sv % 60;
  const mv = (sv - seconds) / 60;
  const minutes = mv % 60;
  const hv = (mv - minutes) / 60;
  const hours = hv;

  return [
    ...(hours && h ? [`${padded ? pad(hours, 2) : hours}h`] : []),
    ...(minutes && m ? [`${padded ? pad(minutes, 2) : minutes}m`] : []),
    ...(seconds && s
      ? [`${padded ? pad(seconds, 2) : seconds}${!ms ? "s" : ""}`]
      : []),
    ...(ms ? [`.${pad(milliseconds, 3)}s`] : []),
  ].join("");
};

const pad = (n, l, char = "0") => {
  const offset = Math.pow(10, l - 1);
  if (n < offset) {
    if (n === 0 && offset === 1) {
      return n;
    }
    return `${char}${pad(n, l - 1, char)}`;
  }
  return n;
};

const arrmin = (arr) => {
  return arr.reduce((acc, num) => Math.min(acc, num), Math.min());
};
const arrmax = (arr) => {
  return arr.reduce((acc, num) => Math.max(acc, num), Math.max());
};

const arrsum = (arr) => {
  return arr.reduce((acc, num) => acc + num, 0);
};

module.exports = {
  humanTime,
  memo,
  pad,
  arrmin,
  arrmax,
  arrsum,
};
