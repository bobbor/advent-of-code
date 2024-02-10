const { read } = require("../utils/file");
const { mkSolution } = require("../utils/answer");

/*
 * function which holds all right or wrong solutions
 */
const solution = () => {
  return mkSolution()
    .right(1, 52, { test: 2 })
    .right(1, 1320, { test: 1 })
    .right(2, 145, { test: 1 })
    .right(1, 515210)
    .wrong(2, { value: 107792, diff: "too low" })
    .right(2, 246762);
};
/*
 * custom logic for Area, parsers, processors goes here
 */

// e.g.
// class Board extends Area {}

/*
 * prepare raw input data for processing
 */
const parseInput = (content) => {
  return content.split(",");
};

/*
 * read content of input file(s)
 */
const readInput = async (opts) => {
  const content = await read(__dirname, opts);
  return parseInput(content);
};

/**
 * puzzle solving helpers
 */

const calcHash = (hash) => {
  let current = 0;
  for (let i = 0; i < hash.length; i++) {
    current += hash.charCodeAt(i);
    current *= 17;
    current = current % 256;
  }
  return current;
};
/**
 * solving first part of the task
 */
const solveTask1 = (hashes) => {
  let start = 0;
  for (const hash of hashes) {
    start += calcHash(hash);
  }
  // go do it, while it's easy
  return start;
};

/**
 * helpers for part 2
 */
const mkLens = (instructions) => {
  const match = /(?<label>[a-z]+)(?<operation>[=\-]{1})(?<focal>[0-9])?/.exec(
    instructions
  );
  const { label, operation, focal } = match.groups;
  const box = calcHash(label);

  if (operation === "=") {
    return {
      box,
      label,
      action: "add",
      value: parseInt(focal),
    };
  }
  return {
    box,
    label,
    action: "remove",
  };
};
const placeInBoxes = (hashes) => {
  const boxes = Array.from({ length: 256 }).map((_) => []);
  for (const hash of hashes) {
    const { box: boxIdx, label, action, value } = mkLens(hash);
    let box = boxes[boxIdx] ?? [];
    if (action === "remove") {
      const labelIndex = box.findIndex(({ label: item }) => item === label);
      if (labelIndex !== -1) {
        boxes[boxIdx] = [
          ...box.slice(0, labelIndex),
          ...box.slice(labelIndex + 1),
        ];
        continue;
      }
      continue;
    }
    const labelIndex = box.findIndex(({ label: item }) => item === label);
    if (labelIndex !== -1) {
      boxes[boxIdx][labelIndex].value = value;
      continue;
    }
    boxes[boxIdx].push({ label, value });
  }
  return boxes;
};
/**
 * solving second part of the task
 */
const solveTask2 = (hashes) => {
  let result = 0;
  const boxes = placeInBoxes(hashes);
  for (let i = 0; i < boxes.length; i++) {
    for (let pos = 0; pos < boxes[i].length; pos++) {
      const itemValue = (i + 1) * (pos + 1) * boxes[i][pos].value;
      result += itemValue;
    }
  }
  return result;
};

const solveDay15 = async (task, test) => {
  const input = await readInput(test);
  const guess = solution().build(task, test);

  let result,
    startTs = performance.now(),
    end;
  switch (task) {
    case 1:
      result = solveTask1(input);
      end = performance.now() - startTs;
      break;
    case 2:
      result = solveTask2(input);
      end = performance.now() - startTs;
      break;
  }
  guess.check(result, end);
};

solveDay15(2);
