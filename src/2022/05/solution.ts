import { Guess, Task, mkSolution } from "utils/answer";
import { rotate } from "utils/string";

/*
 * function which holds all right or wrong solutions
 */
const solution = (task: Task) => {
  return mkSolution(task)
    .right({ part: 1, test: 1 }, "CMZ")
    .right({ part: 1 }, "ZRLJGSCTR")
    .right({ part: 2, test: 1 }, "MCD")
    .right({ part: 2 }, "PRTTGRFPB");
  //.wrong({part: 2}, { guess: 107792, diff: "too low" })
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/*
 * custom logic for Area, parsers, processors goes here
 */

/*
 * prepare raw input data for processing
 */
const parseInput = (
  content: string
): {
  crates: string[][];
  instructions: { start: number; target: number; count: number }[];
} => {
  const [start, rawInstructions] = content.split("\n\n");
  const crates = rotate(start)
    .split("\n")
    .reduce<string[][]>((acc, line) => {
      if (line[0] === " ") {
        return acc;
      }
      const [idx, ...items] = line.trim().split("");
      acc[parseInt(idx) - 1] = items;
      return acc;
    }, []);
  const instructions = rawInstructions.split("\n").map((inst) => {
    const match =
      /^move (?<count>[0-9]+) from (?<start>[0-9]+) to (?<target>[0-9]+)$/.exec(
        inst
      );
    return {
      count: parseInt(match?.groups?.count ?? "-1"),
      target: parseInt(match?.groups?.target ?? "-1"),
      start: parseInt(match?.groups?.start ?? "-1"),
    };
  });
  return {
    crates,
    instructions,
  };
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
const solvePart1 = <T>({
  crates,
  instructions,
}: ReturnType<typeof parseInput>): T => {
  for (const { start, target, count } of instructions) {
    const pickPile = crates[start - 1];
    const dropPile = crates[target - 1];
    for (let i = 0; i < count; i++) {
      const item = pickPile.pop() ?? "";
      dropPile.push(item);
    }
  }
  let out = "";
  for (const pile of crates) {
    out += pile.at(-1);
  }
  return out;
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
const solvePart2 = <T>({
  crates,
  instructions,
}: ReturnType<typeof parseInput>): T => {
  for (const { start, target, count } of instructions) {
    const pickPile = crates[start - 1];
    const dropPile = crates[target - 1];
    const helpPile = [];
    for (let i = 0; i < count; i++) {
      const item = pickPile.pop() ?? "";
      helpPile.push(item);
    }
    for (let i = 0; i < count; i++) {
      const item = helpPile.pop() ?? "";
      dropPile.push(item);
    }
  }
  let out = "";
  for (const pile of crates) {
    out += pile.at(-1);
  }
  return out;
};

/*
 * main function
 *
 * You shouldn't need to touch me
 */
const solveDay = async <T extends Guess>(task: Task) => {
  console.clear();
  const input = await readInput(task);
  const guess = solution(task).build();

  let result: T,
    startTs = performance.now(),
    end: number;
  switch (task.part) {
    case 1:
      result = solvePart1<T>(input);
      end = performance.now() - startTs;
      guess.check(result, end);
      break;
    case 2:
      result = solvePart2<T>(input);
      end = performance.now() - startTs;
      guess.check(result, end);
      break;
  }
};

solveDay<string>({ part: 2 });
