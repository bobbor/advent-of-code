const { read } = require("../utils/file");
const { mkSolution } = require("../utils/answer");
const { Area } = require("../utils/area");

/*
 * function which holds all right or wrong solutions
 */
const solution = () => {
  return mkSolution()
    .right(1, 62, { test: 1 })
    .wrong(1, { value: 451456, diff: "too high" })
    .wrong(1, { value: 58396, diff: "too high" })
    .right(1, 49897)
    .right(2, 952408144115, { test: 1 });
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
  return content.split("\n");
};

/*
 * read content of input file(s)
 */
const readInput = async (opts) => {
  const content = await read(__dirname, opts);
  return parseInput(content);
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/*
 * run part 1 specific logic here
 */
const readInstructions = (lines) => {
  const parseLine = (l) => {
    const [direction, distance, color] = l.split(" ");
    return {
      direction,
      distance: parseInt(distance),
      color: color.replace("(", "").replace(")", "")
    };
  };
  const instructions = lines.map(parseLine);
  const { width, height, heightCheck, widthCheck } = instructions.reduce((acc, { direction, distance }) => {
    if (direction === "R") {
      acc.width += distance;
      acc.widthCheck += distance;
    }
    if (direction === "D") {
      acc.height += distance;
      acc.heightCheck += distance;
    }
    if (direction === "L") {
      acc.widthCheck -= distance;
    }
    if (direction === "U") {
      acc.heightCheck -= distance;
    }
    return acc;
  }, { width: 1, height: 1, widthCheck: 0, heightCheck: 0 });

  if (widthCheck !== 0 || heightCheck !== 0) {
    throw new Error("inconsistent statements");
  }
  return {
    instructions,
    width, height,
    area: new Area({ width: 1, height: 1, value: " " })
  };
};
const fillAround = ([r, c], map) => {
  map.set(`${r}:${c}`, "#");
  const getNeighbors = ([r, c]) => [[r, c + 1], [r, c - 1], [r + 1, c], [r - 1, c]];
  let neighbors = getNeighbors([r, c]);
  while (neighbors.length) {
    const [nr, nc] = neighbors.shift();
    if (nr < map.dims.y || nc < map.dims.x || nr >= map.dims.y + map.dims.height || nc >= map.dims.x + map.dims.width) {
      continue;
    }
    console.log(map.dims.y, nr, map.dims.y + map.dims.height);
    console.log(map.dims.x, nc, map.dims.x + map.dims.width);
    if (map.get(`${nr}:${nc}`) === "#") {
      continue;
    }
    map.set(`${nr}:${nc}`, "#");
    const n = getNeighbors([nr, nc]).filter(neighbor => !neighbors.includes(neighbor) || map.has(`${neighbor[0]}:${neighbor[1]}`));
    neighbors = [...neighbors, ...n];
  }
};

const runAroundDoShit = ({ instructions, width, height }) => {
  let start = [0, 0], last;
  let area = new Map();
  area.dims = { x: 0, y: 0, width, height };
  area.set(`${start[0]}:${start[1]}`, "#");

  const diffs = { R: [0, 1], L: [0, -1], D: [1, 0], U: [-1, 0] };
  let s = performance.now();
  instructions.forEach(({ direction, distance }) => {
    let pos = start;
    const diff = diffs[direction];
    for (let i = 0; i < distance; i++) {
      pos = [start[0] + i * diff[0], start[1] + i * diff[1]];
      area.set(`${pos[0]}:${pos[1]}`, "#");
    }
    last = [start[0] + diff[0] * (distance - 1), start[1] + diff[1] * (distance - 1)];
    start = [start[0] + diff[0] * distance, start[1] + diff[1] * distance];
    area.dims = {
      ...area.dims,
      x: Math.min(area.dims.x, start[1]),
      y: Math.min(area.dims.y, start[0])
    };
  });
  console.log(area.dims);
  console.log("dig", performance.now() - s);
  const diff = diffs[instructions[0].direction];
  last = [last[0] + 1 * diff[0], last[1] + 1 * diff[1]];

  s = performance.now();
  fillAround(last, area);
  console.log("fill", performance.now() - s);

  // let str = "";
  // for (let r = 0; r < 10; r++) {
  //   for (let c = 0; c < 7; c++) {
  //     str += area.has(`${r}:${c}`) ? area.get(`${r}:${c}`) : ".";
  //   }
  //   str += "\n";
  // }
  // console.log(str);
  return Array.from(area.values()).filter(v => v === "#").length;
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Part 1                                                    *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
const solvePart1 = (lines) => {
  const dig = readInstructions(lines);
  return runAroundDoShit(dig);
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/*
 * run part 2 specific logic here
 */

const readRightInstructions = (lines) => {
  const parseLine = (l) => {
    const [, , color] = l.split(" ");
    const hex = color.replace("(#", "").replace(")", "").split("");
    const dir = hex.pop();
    return {
      direction: dir === "0" ? "R" : dir === "1" ? "D" : dir === "2" ? "L" : "U",
      distance: parseInt(hex.join(""), 16)
    };
  };
  const instructions = lines.map(parseLine);
  const { heightCheck, widthCheck } = instructions.reduce((acc, { direction, distance }) => {
    if (direction === "R") {
      acc.width += distance;
      acc.widthCheck += distance;
    }
    if (direction === "D") {
      acc.height += distance;
      acc.heightCheck += distance;
    }
    if (direction === "L") {
      acc.widthCheck -= distance;
    }
    if (direction === "U") {
      acc.heightCheck -= distance;
    }
    return acc;
  }, { width: 1, height: 1, widthCheck: 0, heightCheck: 0 });

  if (widthCheck !== 0 || heightCheck !== 0) {
    throw new Error("inconsistent statements");
  }
  return {
    instructions,
    area: new Area({ width: 1, height: 1, value: " " })
  };
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Part 2                                                    *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
const solvePart2 = (lines) => {
  const { area, instructions } = readRightInstructions(lines);
  runAroundDoShit({ area, instructions });
  return 0;
};

/*
 * main function
 * 
 * You shouldn't need to touch me
 */
const solveDay18 = async (task) => {
  const { task: part, test } = task;
  const input = await readInput(test ? { test } : {});
  const guess = solution().build(task);

  let result,
    startTs = performance.now(),
    end;
  switch (part) {
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

solveDay18({ task: 1 });
