import { Task, mkSolution } from "utils/answer";
import { Area, Item } from "utils/area";

/*
 * function which holds all right or wrong solutions
 */
const solution = (task: Task) => {
  return mkSolution(task)
    .right({ part: 1, test: 1 }, 21)
    .right({ part: 2, test: 1 }, 8);
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
const parseInput = (content: string): Area<number> => {
  return new Area(
    content
      .split("\n")
      .map((line) => line.split("").map((item) => parseInt(item)))
  );
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

const getRowsAndColumnsAround = (
  element: Item<number>
): {
  north: Item<number>[];
  south: Item<number>[];
  west: Item<number>[];
  east: Item<number>[];
} => {
  const area = element.area;
  const column = area.getColumn(element.position.column);
  const row = area.getRow(element.position.row);

  const north = column
    .filter((col) => col.position.row < element.position.row)
    .reverse();
  const south = column.filter((col) => col.position.row > element.position.row);
  const west = row
    .filter((row) => row.position.column < element.position.column)
    .reverse();
  const east = row.filter(
    (row) => row.position.column > element.position.column
  );

  return { north, south, west, east };
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Part 1                                                    *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
const solvePart1 = (area: ReturnType<typeof parseInput>): number => {
  let visibleCount = 0;
  for (const element of area) {
    if (element !== undefined) {
      let visible = false;
      const { north, south, east, west } = getRowsAndColumnsAround(element);
      if (!(north.length && south.length && west.length && east.length)) {
        visible = true;
      }
      if (!visible) {
        const northHidden = north.some((item) => item.value >= element.value);
        const eastHidden = east.some((item) => item.value >= element.value);
        const westHidden = west.some((item) => item.value >= element.value);
        const southHidden = south.some((item) => item.value >= element.value);
        if (!(northHidden && eastHidden && westHidden && southHidden)) {
          visible = true;
        }
      }
      if (visible) {
        visibleCount++;
      }
    }
  }
  return visibleCount;
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/*
 * run part 2 specific logic here
 */

const directionalScore = (
  direction: Item<number>[],
  element: Item<number>
): number => {
  let score = 0;
  const index = direction.findIndex((item) => item.value >= element.value);
  if (index === -1) {
    score = direction.length;
  } else {
    score = index + 1;
  }
  return score;
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Part 2                                                    *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
const solvePart2 = (area: ReturnType<typeof parseInput>): number => {
  let scenicScore = 0;
  for (const element of area) {
    if (element !== undefined) {
      const { north, south, east, west } = getRowsAndColumnsAround(element);
      const nScore = directionalScore(north, element);
      const sScore = directionalScore(south, element);
      const wScore = directionalScore(west, element);
      const eScore = directionalScore(east, element);

      scenicScore = Math.max(scenicScore, nScore * sScore * wScore * eScore);
    }
  }
  return scenicScore;
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
