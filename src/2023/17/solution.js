const { read } = require("../utils/file");
const { mkSolution } = require("../utils/answer");
const { Area } = require("../utils/area");
const { AreaWalker, Walker } = require("../utils/walker");

/*
 * function which holds all right or wrong solutions
 */
const solution = () => {
  return mkSolution().right(1, 102, { test: 1 });
  //.right(2, 145, { test: 1 })
  //.wrong(2, { value: 107792, diff: "too low" })
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/*
 * custom logic for Area, parsers, processors goes here
 */

// e.g.
// class Board extends Area {}

/*
 * prepare raw input data for processing
 */
const parseInput = (content) => {
  return new Area(content.split("\n").map((_) => _.split("")));
};

/*
 * read content of input file(s)
 */
const readInput = async (test) => {
  const opts = { ...(test ? { test } : {}) };
  const content = await read(__dirname, opts);
  return parseInput(content);
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/*
 * run part 1 specific logic here
 */

const AStarSearch = (area) => {};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Part 1                                                    *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
const solvePart1 = (area) => {
  const search = AStarSearch(area);
  return 0;
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/*
 * run part 2 specific logic here
 */

// ...
// ...
// ...

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Part 2                                                    *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
const solvePart2 = (input) => {
  // good luck
  return 0;
};

/*
 * main function
 *
 * You shouldn't need to touch me
 */
const solveDay17 = async ({ task, test }) => {
  const input = await readInput(test);
  const guess = solution().build({ task, test });

  let result,
    startTs = performance.now(),
    end;
  switch (task) {
    case 1:
      result = solvePart1(input);
      end = performance.now() - startTs;
      break;
    case 2:
      result = solvePart2(input);
      end = performance.now() - startTs;
      break;
  }
  guess.check(result, end);
};

solveDay17({ task: 1, test: 1 });
