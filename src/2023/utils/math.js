const { memo } = require("./helper");

const ggt = (a, b) => {
  if (!a) return b;
  if (!b) return a;
  if (a < b) {
    return ggt(b, a);
  }
  return ggt(b, a % b);
};
const kgv = (...nums) => {};

const fak = memo("fac", (num) => {
  if (num < 0) {
    throw new Error("num < 0.");
  }
  if (num === 0) {
    return 1;
  }
  return num * fak(num - 1);
});

const choose = (num, k) => {
  const a = Math.max(num, k);
  const b = Math.min(num, k);

  const _a = fak(a);
  const _b = fak(b);
  const _c = fak(a - b);
  return _a / (_b * _c);
};

module.exports = {
  ggt,
  kgv,
  fak,
  choose,
};
