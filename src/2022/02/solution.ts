import { Task, mkSolution } from "../../utils/answer";

/*
 * function which holds all right or wrong solutions
 */
const solution = (task: Task) => {
  return mkSolution(task)
    .right({ part: 1 }, 9241)
    .right({ part: 2 }, 14610)
    .right({ part: 1, test: 1 }, 15)
    .right({ part: 2, test: 1 }, 12);
  //.wrong(2, { value: 107792, diff: "too low" })
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/*
 * custom logic for Area, parsers, processors goes here
 */

// [WIN, DRAW, LOSS]
const GAMETABLE = {
  A: ["Y", "X", "Z"],
  B: ["Z", "Y", "X"],
  C: ["X", "Z", "Y"],
};

const STRAT = ["Z", "Y", "X"];
const VALUES = ["X", "Y", "Z"];
const POINTS = [6, 3, 0];

/*
 * prepare raw input data for processing
 */
const parseInput = (content: {
  default: string;
}): ["A" | "B" | "C", "X" | "Y" | "Z"][] => {
  const fileContent = content.default;
  return fileContent
    .split("\n")
    .map((line) => line.split(" ") as ["A" | "B" | "C", "X" | "Y" | "Z"]);
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
    input: () => import("./data/input.txt"),
    test1: () => import("./data/test1.txt"),
  };
  let file = files.input;
  if (task.test) {
    file = files[`test${task.test}`];
  }
  const content = await file();
  return parseInput(content);
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/*
 * run part 1 specific logic here
 */
const calcPoints = (elf: "A" | "B" | "C", me: "X" | "Y" | "Z") =>
  VALUES.indexOf(me) + POINTS[GAMETABLE[elf].indexOf(me)] + 1;

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Part 1                                                    *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
const solvePart1 = (games: ReturnType<typeof parseInput>): number => {
  return games.reduce((n, [elf, me]) => n + calcPoints(elf, me), 0);
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/*
 * run part 2 specific logic here
 */
const calcAltPoints = (elf: "A" | "B" | "C", me: "X" | "Y" | "Z") =>
  POINTS[STRAT.indexOf(me)] +
  VALUES.indexOf(GAMETABLE[elf][STRAT.indexOf(me)]) +
  1;

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Part 2                                                    *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
const solvePart2 = (games: ReturnType<typeof parseInput>): number => {
  return games.reduce((n, [elf, me]) => n + calcAltPoints(elf, me), 0);
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

  let result,
    startTs = performance.now(),
    end;
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
