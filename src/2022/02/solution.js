const { read } = require("../utils/file");

// [WIN, DRAW, LOSS]
const GAMETABLE = {
  A: ["Y", "X", "Z"],
  B: ["Z", "Y", "X"],
  C: ["X", "Z", "Y"],
};

const STRAT = ["Z", "Y", "X"];
const VALUES = ["X", "Y", "Z"];
const POINTS = [6, 3, 0];
const calcPoints = (elf, me) =>
  VALUES.indexOf(me) + POINTS[GAMETABLE[elf].indexOf(me)] + 1;
const calcAltPoints = (elf, me) =>
  POINTS[STRAT.indexOf(me)] +
  VALUES.indexOf(GAMETABLE[elf][STRAT.indexOf(me)]) +
  1;

const getGames = async (opts) => {
  const content = await read(__dirname, opts);
  return content.split("\n").map((_) => _.split(" "));
};

(async () => {
  const games = await getGames();
  const [total, altTotal] = games.reduce(
    ([n, a], game) => [n + calcPoints(...game), a + calcAltPoints(...game)],
    [0, 0]
  );
  console.log(`the solution is ${total} and ${altTotal}`);
})();
