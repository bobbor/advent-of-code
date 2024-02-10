const { read } = require("../utils/file");
const { mkSolution } = require("../utils/answer");
const { arrsum } = require("../utils/helper");
const { choose } = require("../utils/math");

/*
 * function which holds all right or wrong solutions
 */
const solution = () => {
  return mkSolution()
    .right(1, 21, { test: 1 })
    .right(1, 7857)
    .right(2, 525152, { test: 1 });

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
  return content.split("\n").map((line) => {
    const [nono, areasStatement] = line.split(" ");
    const areas = areasStatement.split(",").map((_) => parseInt(_));
    const segments = nono
      .replace(/\.+/g, ".")
      .replace(/^\./, "")
      .replace(/\.$/, "")
      .split(".");
    return {
      segments,
      counts: areas,
    };
  });
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

let picrosssum = (arr) => arr.reduce((a, n, i) => a + n + (i ? 1 : 0), 0);
const getPermutations = ({ segments, counts }) => {
  let perm = 0;
  let taken = segments.length > 0 && /(?<def>^#+$)/.test(segments[0]);
  while (taken) {
    segments.shift();
    counts.shift();
    taken = segments.length > 0 && /(?<def>^#+$)/.test(segments[0]);
  }
  taken = segments.length > 0 && /(?<def>^#+$)/.test(segments.at(-1));
  while (taken) {
    segments.pop();
    counts.pop();
    taken = segments.length > 0 && /(?<def>^#+$)/.test(segments.at(-1));
  }
  let unknown = segments.length > 0 ? /(?<def>^\?+$)/.exec(segments[0]) : null;
  while (unknown !== null) {
    const match = unknown.groups.def;
    const pick = [counts.shift()];
    while (true) {
      if (arrsum([...pick, counts[0]]) + pick.length <= match.length) {
        pick.push(counts.shift());
        continue;
      }
      break;
    }
    const [first, ...rest] = pick;
    const subPerm = rest.reduce((acc, n) => acc + n + 1, 0);
    perm += choose(segments[0].length - subPerm, first);
    segments.shift();
    unknown = segments.length > 0 ? /(?<def>^\?+$)/.exec(segments[0]) : null;
  }
  unknown = segments.length > 0 ? /(?<def>^\?+$)/.exec(segments.at(-1)) : null;
  while (unknown !== null) {
    const match = unknown.groups.def;
    const pick = [counts.pop()];
    while (true) {
      if (arrsum([...pick, counts.at(-1)]) + pick.length - 1 <= match.length) {
        pick.push(counts.pop());
        continue;
      }
      break;
    }
    const [first, ...rest] = pick;
    const subPerm = rest.reduce((acc, n) => acc + n + 1, 0);
    perm += choose(segments[0].length - subPerm, first);
    segments.pop();
    unknown =
      segments.length > 0 ? /(?<def>^\?+$)/.exec(segments.at(-1)) : null;
  }

  if (segments.length === 0 && counts.length === 0) {
    return perm;
  }

  const firstSegment = segments[0];
  if (picrosssum(counts) !== firstSegment.length) {
    let start = 0;
    const firstNum = counts[0];
    let re = new RegExp(`^\\?{${firstNum + 1}}`);
    if (re.test(firstSegment)) {
      perm += getPermutations({
        segments: [
          ...segments[0].slice(0, firstNum),
          ...segments[0].slice(firstNum + 1),
          ...segments.slice(1),
        ],
        counts: counts.slice(1),
      });
    }
    while (picrosssum(counts) + start < firstSegment.length) {
      const str = firstSegment.substring(start, firstSegment.length);
      start++;
    }
  } else {
    perm = 1;
  }
  return perm;
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Part 1                                                    *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
const solvePart1 = (picross) => {
  let result = 0;
  // for (const line of picross) {
  //   const perm = getPermutations(line);
  //   result += perm;
  // }
  console.log(getPermutations(picross[5]));
  //console.log(getPermutations(picross[5]));
  return result;
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
const solveDay12 = async (task, test) => {
  const input = await readInput(test);
  const guess = solution().build(task, test);

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

solveDay12(1, { test: 1 });
