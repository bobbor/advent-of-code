import { Task, mkSolution } from "utils/answer";

/*
 * function which holds all right or wrong solutions
 */
const solution = (task: Task) => {
  return mkSolution(task)
    .right({ part: 1, test: 1 }, 13)
    .right({ part: 2, test: 1 }, 1)
    .right({ part: 2, test: 2 }, 36);
  //.wrong({part: 2}, { guess: 107792, diff: "too low" })
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/*
 * custom logic for Area, parsers, processors goes here
 */
interface Instruction {
  direction: "R" | "U" | "L" | "D";
  count: number;
}
type Instructions = Instruction[];

/*
 * prepare raw input data for processing
 */
const parseInput = (content: string): Instructions => {
  return content.split("\n").map((line) => {
    const [direction, count] = line.split(" ");
    return { direction, count: parseInt(count) } as Instruction;
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
    test2: () => import("./test2.txt"),
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
interface Position {
  x: number;
  y: number;
}

type Diff = Position;

const diff = (src: Position, target: Position): Diff => {
  return {
    x: Math.abs(src.x - target.x),
    y: Math.abs(src.y - target.y),
  };
};
const distance = (src: Position, target: Position): number => {
  const { x, y } = diff(src, target);
  return Math.max(x, y);
};
const adjacent = (src: Position, target: Position): boolean => {
  return distance(src, target) < 2;
};
const stringify = (pos: Position): string => {
  return `${pos.x}:${pos.y}`;
};
const moveHead = (head: Position, dir: "D" | "U" | "L" | "R"): void => {
  switch (dir) {
    case "R":
      head.x++;
      break;
    case "L":
      head.x--;
      break;
    case "D":
      head.y++;
      break;
    case "U":
      head.y--;
      break;
  }
};
const moveTail = (tail: Position, head: Position): void => {
  const { x, y } = diff(tail, head);
  if (x !== 0) {
    tail.x += (head.x - tail.x) / Math.abs(head.x - tail.x);
  }
  if (y !== 0) {
    tail.y += (head.y - tail.y) / Math.abs(head.y - tail.y);
  }
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Part 1                                                    *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
const solvePart1 = (instructions: ReturnType<typeof parseInput>): number => {
  const head = {
    x: 0,
    y: 0,
  };
  const tail = {
    x: 0,
    y: 0,
  };
  const positions = new Set();
  positions.add(stringify(tail));

  for (const { direction, count } of instructions) {
    for (let step = 0; step < count; step++) {
      moveHead(head, direction);
      if (!adjacent(tail, head)) {
        moveTail(tail, head);
        positions.add(stringify(tail));
      }
    }
  }

  return positions.size;
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
const solvePart2 = (instructions: ReturnType<typeof parseInput>): number => {
  const knots = [
    {
      //head
      x: 0,
      y: 0,
    },
    {
      x: 0,
      y: 0,
    },
    {
      x: 0,
      y: 0,
    },
    {
      x: 0,
      y: 0,
    },
    {
      x: 0,
      y: 0,
    },
    {
      x: 0,
      y: 0,
    },
    {
      x: 0,
      y: 0,
    },
    {
      x: 0,
      y: 0,
    },
    {
      x: 0,
      y: 0,
    },
    {
      x: 0,
      y: 0,
    },
  ];

  const positions = new Set();
  positions.add(stringify(knots.at(-1)!));

  for (const { direction, count } of instructions) {
    dirloop: for (let step = 0; step < count; step++) {
      moveHead(knots[0], direction);
      for (let i = 1; i < knots.length; i++) {
        if (!adjacent(knots[i], knots[i - 1])) {
          moveTail(knots[i], knots[i - 1]);
          if (i === knots.length - 1) {
            positions.add(stringify(knots[i]));
          }
        } else {
          continue dirloop;
        }
      }
    }
  }

  return positions.size;
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
