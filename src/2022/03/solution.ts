import { Task, mkSolution } from "utils/answer";

/*
 * function which holds all right or wrong solutions
 */
const solution = (task: Task) => {
  return mkSolution(task)
    .right({ part: 1, test: 1 }, 157)
    .right({ part: 2, test: 1 }, 70);
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
const parseInput = (content: string): string[] => {
  return content.split("\n");
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
const getPriorityForCharacter = (char?: string): number => {
  let code = char?.charCodeAt(0) ?? 0;
  if (code >= 97 && code <= 122) {
    code -= 97 - 1;
  } else if (code >= 65 && code <= 90) {
    code -= 65 - 27;
  }
  return code;
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Part 1                                                    *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
const solvePart1 = (input: ReturnType<typeof parseInput>): number => {
  return input.reduce((acc, line) => {
    const len = line.length;
    const left = line.slice(0, len / 2);
    const right = line.slice(len / 2);
    const char = left.split("").find((char) => right.indexOf(char) !== -1);
    const code = getPriorityForCharacter(char);
    return acc + code;
  }, 0);
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
const solvePart2 = (input: ReturnType<typeof parseInput>): number => {
  let result = 0;
  grouploop: for (let i = 0; i < input.length; i += 3) {
    const first = input[i];
    const second = input[i + 1];
    const third = input[i + 2];
    for (let j = 0; j < first.length; j++) {
      if (second.indexOf(first[j]) !== -1 && third.indexOf(first[j]) !== -1) {
        result += getPriorityForCharacter(first[j]);
        continue grouploop;
      }
    }
  }
  return result;
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
      break;
    case 2:
      result = solvePart2(input);
      end = performance.now() - startTs;
      break;
  }
  guess.check(result, end);
};

solveDay({ part: 2 });
