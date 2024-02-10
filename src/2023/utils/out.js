const x = "\x1b[0m";
const u = "\x1b[4m";
const d = "\x1b[2m";
const bl = "\x1b[5m";

const r = "\x1b[31m";
const g = "\x1b[32m";
const c = "\x1b[36m";
const b = "\x1b[34m";
// Bright = "\x1b[1m";
//
// Blink = "\x1b[5m";
// Reverse = "\x1b[7m";
// Hidden = "\x1b[8m";

// FgBlack = "\x1b[30m";
// FgYellow = "\x1b[33m";
// FgMagenta = "\x1b[35m";
// FgWhite = "\x1b[37m";
// FgGray = "\x1b[90m";

// BgBlack = "\x1b[40m";
// BgRed = "\x1b[41m";
// BgGreen = "\x1b[42m";
// BgYellow = "\x1b[43m";
// BgBlue = "\x1b[44m";
// BgMagenta = "\x1b[45m";
// BgCyan = "\x1b[46m";
// BgWhite = "\x1b[47m";
// BgGray = "\x1b[100m";

const hilite = (strings, ...values) => {
  let out = "";
  for (let i = 0; i < values.length; i++) {
    out += strings[i] + u + values[i] + x;
  }
  return out + strings[strings.length - 1];
};

const mergeAll = (strings, ...values) => {
  let out = "";
  for (let i = 0; i < values.length; i++) {
    out += `${strings[i]}${values[i]}`;
  }
  return `${out}${strings[strings.length - 1]}`;
};
const red = (strings, ...values) => `${r}${mergeAll(strings, ...values)}${x}`;
const green = (strings, ...values) => `${g}${mergeAll(strings, ...values)}${x}`;
const cyan = (strings, ...values) => `${c}${mergeAll(strings, ...values)}${x}`;
const blue = (strings, ...values) => `${b}${mergeAll(strings, ...values)}${x}`;

const dim = (strings, ...values) => `${d}${mergeAll(strings, ...values)}${x}`;
const blink = (strings, ...values) =>
  `${bl}${mergeAll(strings, ...values)}${x}`;

module.exports = {
  hilite,
  red,
  green,
  cyan,
  dim,
  blink,
  blue,
};
