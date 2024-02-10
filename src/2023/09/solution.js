const { read } = require("../utils/file");
const answers = {
  q1: {
    right: 1479011877,
    wrong: [1488360717, 546681361],
  },
  q2: {
    right: 973,
    wrong: [],
  },
};
const readFile = async (test) => {
  let content;
  if (test === 1) {
    content = `0 3 6 9 12 15`;
  } else if (test === 2) {
    content = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`;
  } else if (test === 3) {
    content = "10 13 16 21 30 45";
  } else {
    content = await read(__dirname);
  }
  return content.split("\n");
};

const getDiffRight = (line) => {
  let arr = line.split(" ").map((_) => parseInt(_.trim()));
  let lastNumbers = [];
  let idx = 0;
  do {
    const diffs = [];
    for (let i = 0; i < arr.length - 1; i++) {
      diffs.push(arr[i + 1] - arr[i]);
    }
    lastNumbers.push(arr.at(-1));
    arr = diffs;
    idx++;
  } while (!arr.every((_) => !_));
  return lastNumbers.reverse().reduce((acc, num) => num + acc, 0);
};

const getDiffLeft = (line) => {
  let arr = line.split(" ").map((_) => parseInt(_.trim()));
  let firstNumbers = [];
  let idx = 0;
  do {
    const diffs = [];
    for (let i = 0; i < arr.length - 1; i++) {
      diffs.push(arr[i + 1] - arr[i]);
    }
    firstNumbers.push(arr.at(0));
    arr = diffs;
    idx++;
  } while (!arr.every((_) => !_));
  return firstNumbers.reverse().reduce((acc, num) => {
    return num - acc;
  }, 0);
};
(async () => {
  const entries = await readFile();
  const numbersRight = entries.map(getDiffRight);
  const solutionRight = numbersRight.reduce((a, n) => a + n, 0);
  console.log(`the solution to task1 is ${solutionRight}`);
  if (answers.q1.wrong.includes(solutionRight)) {
    console.log("but it's wrong");
  } else if (answers.q1.right === solutionRight) {
    console.log("and it's right");
  }
  const numbersLeft = entries.map(getDiffLeft);
  const solutionLeft = numbersLeft.reduce((a, n) => a + n, 0);
  console.log(`the solution to task2 is ${solutionLeft}`);
  if (answers.q2.wrong.includes(solutionLeft)) {
    console.log("but it's wrong");
  } else if (answers.q2.right === solutionLeft) {
    console.log("and it's right");
  }
})();
