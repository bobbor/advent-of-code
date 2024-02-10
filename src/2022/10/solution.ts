import { Task, mkSolution } from "utils/answer";

/*
 * function which holds all right or wrong solutions
 */
const solution = (task: Task) => {
  return mkSolution(task)
    .right({ part: 1, test: 1 }, 13140)
    .wrong({ part: 1 }, 14000, "too high")
    .right(
      { part: 2, test: 1 },
      `##..##..##..##..##..##..##..##..##..##..
###...###...###...###...###...###...###.
####....####....####....####....####....
#####.....#####.....#####.....#####.....
######......######......######......####
#######.......#######.......#######.....`
    );
  //.wrong({part: 2}, { guess: 107792, diff: "too low" })
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/*
 * custom logic for Area, parsers, processors goes here
 */
interface NoopInstruction {
  action: "noop";
}
interface AddInstruction {
  action: "addx";
  value: number;
}
type Instruction = NoopInstruction | AddInstruction;
type Program = Instruction[];
// e.g.
// class Board extends Area {}

/*
 * prepare raw input data for processing
 */
const parseInput = (content: string): Program => {
  return content.split("\n").map((line) => {
    const [action, value] = line.split(" ");
    if (action === "noop") {
      return { action } as NoopInstruction;
    }
    return { action, value: parseInt(value) } as AddInstruction;
  });
};

/*
 * read content of input file(s)
 */
const readInput = async (
  task: Task
): Promise<ReturnType<typeof parseInput>> => {
  const files: Record<
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
const solvePart1 = (program: ReturnType<typeof parseInput>): number => {
  let result = 0;
  let current = 1;
  const out = [];
  for (const instruction of program) {
    switch (instruction.action) {
      case "noop":
        out.push(current);
        break;
      case "addx":
        out.push(current);
        out.push(current);
        current += instruction.value;
    }
  }
  const registers = [20];
  while (registers.at(-1)! + 40 < out.length) {
    registers.push(registers.at(-1)! + 40);
  }
  for (const index of registers) {
    result += index * out[index - 1];
  }
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
const solvePart2 = (program: ReturnType<typeof parseInput>): number => {
  const spriteMap: string[][] = [[]];
  let row = 0;
  let col = 0;
  let current = 1;
  // moving the pixels
  const print = () => {
    if (current - 1 === col || col === current || col === current + 1) {
      spriteMap[row].push("@");
    } else {
      spriteMap[row].push(" ");
    }
    col = spriteMap[row].length;
    if (col >= 40) {
      row += 1;
      spriteMap[row] = [];
      col = 0;
    }
  };
  for (const instruction of program) {
    switch (instruction.action) {
      case "noop":
        print();
        break;
      case "addx":
        print();
        print();
        current += instruction.value;
    }
  }

  console.log(spriteMap.map((inner) => inner.join("")).join("\n"));
  return 0;
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

  let result: number, end: number;
  const startTs = performance.now();
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
