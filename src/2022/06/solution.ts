import { Task, mkSolution } from "utils/answer";

/*
 * function which holds all right or wrong solutions
 */
const solution = (task: Task) => {
  return mkSolution(task)
    .right({ part: 1, test: 1 }, 7)
    .right({ part: 1, test: 2 }, 5)
    .right({ part: 1, test: 3 }, 6)
    .right({ part: 1, test: 4 }, 10)
    .right({ part: 1, test: 5 }, 11)
    .right({ part: 1 }, 1647)
    .right({ part: 2, test: 1 }, 19)
    .right({ part: 2, test: 2 }, 23)
    .right({ part: 2, test: 3 }, 23)
    .right({ part: 2, test: 4 }, 29)
    .right({ part: 2, test: 5 }, 26);
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
const parseInput = (content: string): string => {
  return content;
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
    test2: () => import("./test2.txt"),
    test3: () => import("./test3.txt"),
    test4: () => import("./test4.txt"),
    test5: () => import("./test5.txt"),
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
const solvePart1 = (signal: ReturnType<typeof parseInput>): number => {
  let offset = 0;
  const len = 4;
  for (let idx = len; idx < signal.length; idx++) {
    const marker = signal.slice(idx - len, idx);
    const uniq = marker
      .split("")
      .reduce((set, char) => set.add(char), new Set());
    if (uniq.size === len) {
      offset = idx;
      break;
    }
  }
  return offset;
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
const solvePart2 = (signal: ReturnType<typeof parseInput>): number => {
  let offset = 0;
  const len = 14;
  for (let idx = len; idx < signal.length; idx++) {
    const marker = signal.slice(idx - len, idx);
    const uniq = marker
      .split("")
      .reduce((set, char) => set.add(char), new Set());
    if (uniq.size === len) {
      offset = idx;
      break;
    }
  }
  return offset;
};

/*
 * main function
 *
 * You shouldn't need to touch me
 */
interface TaskList {
  part: Task["part"];
  test?: number | number[];
}
const solveSingleTaskForDay = async (task: Task) => {
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
const solveDay = async (task: TaskList) => {
  console.clear();
  if (Array.isArray(task.test)) {
    task.test.forEach((test) => {
      solveSingleTaskForDay({
        part: task.part,
        test,
      });
    });
    return;
  }
  solveSingleTaskForDay({
    part: task.part,
    test: Array.isArray(task.test) ? task.test[0] : task.test,
  });
};

solveDay({ part: 2 });
