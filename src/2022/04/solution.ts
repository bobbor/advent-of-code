import { Task, mkSolution } from "utils/answer";

/*
 * function which holds all right or wrong solutions
 */
const solution = (task: Task) => {
  return mkSolution(task)
    .right({ part: 1, test: 1 }, 2)
    .wrong({ part: 1 }, 936, "too high")
    .right({ part: 1 }, 441)
    .right({ part: 2, test: 1 }, 4);
  //.wrong({part: 2}, { guess: 107792, diff: "too low" })
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
interface Range {
  lower: number;
  upper: number;
}
const parseInput = (content: string): [Range, Range][] => {
  return content.split("\n").map((line) => {
    const [left, right] = line.split(",");
    const [llower, lupper] = left.split("-").map((_) => parseInt(_));
    const [rlower, rupper] = right.split("-").map((_) => parseInt(_));
    return [
      { lower: llower, upper: lupper },
      { lower: rlower, upper: rupper },
    ];
  });
};

/*
 * read content of input file(s)
 */
const readInput = async (
  task: Task
): Promise<ReturnType<typeof parseInput>> => {
  let files: Record<
    string | `test${number}`,
    () => Promise<{ default: string }>
  > = {
    input: () => import("./input.txt"),
    test1: () => import("./test1.txt"),
  };
  let file = files.input;
  if (task.test) {
    file = files[`test${task.test}`];
  }
  const content = await file();
  return parseInput(content.default);
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/*
 * run part 1 specific logic here
 */

// ...
// ...
// ...

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Part 1                                                    *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
const solvePart1 = (ranges: ReturnType<typeof parseInput>): number => {
  let contained = 0;
  for (const [first, second] of ranges) {
    const flen = first.upper - first.lower,
      slen = second.upper - second.lower;
    if (flen === slen && first.lower === second.lower) {
      contained++;
      continue;
    }
    if (
      flen < slen &&
      second.lower <= first.lower &&
      second.upper >= first.upper
    ) {
      contained++;
      continue;
    }
    if (
      slen < flen &&
      first.lower <= second.lower &&
      first.upper >= second.upper
    ) {
      contained++;
      continue;
    }
  }
  return contained;
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
const solvePart2 = (ranges: ReturnType<typeof parseInput>): number => {
  let contained = 0;
  loop: for (const [first, second] of ranges) {
    if (first.lower <= second.lower) {
      if (second.lower <= first.upper) {
        contained++;
      }
      continue loop;
    }
    if (first.lower <= second.upper) {
      contained++;
      continue loop;
    }
  }
  return contained;
};

/*
 * main function
 *
 * You shouldn't need to touch me
 */
const solveDay = async (task: Task) => {
  console.clear();
  const input = await readInput(task);
  const guess = solution(task).build();

  let result: number,
    startTs = performance.now(),
    end: number;
  switch (task.part) {
    case 1:
      result = solvePart1(input);
      end = performance.now() - startTs;
      guess.check(result, end);
      break;
    case 2:
      result = solvePart2(input);
      end = performance.now() - startTs;
      guess.check(result, end);
      break;
  }
};

solveDay({ part: 2 });
