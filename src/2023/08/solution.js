const assert = require("assert");
const { getPermutations } = require("../utils/array");
const { read } = require("../utils/file");
const { faculty, facultychoose, kgv, ggt } = require("../utils/math");

const multi = true;
const rightAnswers = {
  q1: {
    test1: 2,
    test2: 6,
    input: 13301,
  },
  q2: {
    test1: 6,
  },
};

const wrongAnswers = {
  q2: ["1156621"],
};

const readFile = async (test) => {
  if (test === 1) {
    return `RL
AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`;
  }
  if (test === 2) {
    return `LLR
AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`;
  }
  if (test === 3) {
    return `LR
11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`;
  }
  return await read(__dirname);
};

const parseFile = (data) => {
  const [walk, ...elements] = data.split("\n");
  return {
    instructions: walk.split(""),
    nodes: elements.reduce((acc, element) => {
      const match = /^([12A-Z]{3})\s=\s\(([12A-Z]{3}),\s([12A-Z]{3})\)$/.exec(
        element
      );
      if (match === null) {
        throw new Error("mismatch", element);
      }
      acc[match[1]] = {
        L: match[2],
        R: match[3],
      };
      return acc;
    }, {}),
  };
};
const walk = ({ instructions, nodes }) => {
  let start;
  let stepCounter = [];
  if (multi) {
    start = Object.keys(nodes).filter((node) => node[2] === "A");
  } else {
    start = ["AAA"];
  }
  for (let current of start) {
    let steps = 0;
    let finished = false;
    do {
      const idx = steps % instructions.length;
      const dir = instructions[idx];
      steps += 1;
      current = nodes[current][dir];
      finished = multi ? current[2] === "Z" : current === "ZZZ";
    } while (!finished);
    stepCounter.push(steps);
  }
  return stepCounter;
};

(async () => {
  const content = await readFile();
  const parsed = parseFile(content);
  const steps = walk(parsed);
  const out = kgv(...steps);
  console.log("steps:", out);
  if (wrongAnswers.q2.includes(out)) {
    console.log("but is wrong");
  }
})();
