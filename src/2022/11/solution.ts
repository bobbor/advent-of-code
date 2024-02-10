import chalk from "chalk";
import { type Task, mkSolution } from "utils/answer";

/*
 * function which holds all right or wrong solutions
 */
const solution = (task: Task) => {
  return mkSolution(task)
    .right({ part: 1, test: 1 }, 10605)
    .right({ part: 2, test: 1 }, 2713310158);
  //.wrong({part: 2}, { guess: 107792, diff: "too low" })
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/*
 * custom logic for Area, parsers, processors goes here
 */
interface Monkey {
  items: number[];
  operation: Function;
  test: number;
  validTarget: number;
  invalidTarget: number;
}
// e.g.
// class Board extends Area {}

/*
 * prepare raw input data for processing
 */
const parseInput = (content: string): Monkey[] => {
  const parsed = content.split("\n\n").map((monkey) => {
    const [, rawItems, rawOperation, rawTest, rawValid, rawInvalid] =
      monkey.split("\n");
    const [, itemsStr] = rawItems.split(":");
    const items = itemsStr.split(",").map((_) => parseInt(_.trim()));
    const [, operationStr] = rawOperation.split(":");
    const operation = new Function(
      "old",
      `let ${operationStr.trim().replace(/new/, "newVal")}; return newVal`
    );
    const [, testStr] = rawTest.split(":");
    const testMatch = /^divisible by (?<div>[0-9]+)$/.exec(testStr.trim());
    const testNum = parseInt(testMatch?.groups?.div ?? "-1");
    const [, validStr] = rawValid.split(":");
    const validMatch = /^throw to monkey (?<target>[0-9]+)$/.exec(
      validStr.trim()
    );
    const validTarget = parseInt(validMatch?.groups?.target ?? "-1");
    const [, invalidStr] = rawInvalid.split(":");
    const invalidMatch = /^throw to monkey (?<target>[0-9]+)$/.exec(
      invalidStr.trim()
    );
    const invalidTarget = parseInt(invalidMatch?.groups?.target ?? "-1");

    return {
      items,
      operation,
      test: testNum,
      validTarget,
      invalidTarget,
    };
  });
  return parsed;
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
const solvePart1 = (monkeys: ReturnType<typeof parseInput>): number => {
  const count = Array.from({ length: monkeys.length }).map(() => 0);
  const amountOfRounds = 20;
  for (let i = 0; i < amountOfRounds; i++) {
    for (let m = 0; m < monkeys.length; m++) {
      const monkey = monkeys[m];
      count[m] += monkey.items.length;
      while (monkey.items.length) {
        const item = monkey.items.shift();
        let newVal = monkey.operation(item);
        newVal = Math.floor(newVal / 3);
        const validity = newVal % monkey.test === 0;
        const target = validity ? monkey.validTarget : monkey.invalidTarget;
        monkeys[target].items.push(newVal);
      }
    }
  }
  count.sort((a, b) => b - a);
  return count[0] * count[1];
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
const solvePart2 = (monkeys: ReturnType<typeof parseInput>): number => {
  const count = Array.from({ length: monkeys.length }).map(() => 0);
  const amountOfRounds = 20;
  for (let i = 0; i < amountOfRounds; i++) {
    for (let m = 0; m < monkeys.length; m++) {
      const monkey = monkeys[m];
      count[m] += monkey.items.length;
      while (monkey.items.length) {
        let item = monkey.items.shift()!;
        let newVal = monkey.operation(item);
        if (item % monkey.test === 0) {
          item /= monkey.test;
          newVal = item;
        }
        const validity = newVal % monkey.test === 0;
        const target = validity ? monkey.validTarget : monkey.invalidTarget;
        monkeys[target].items.push(newVal);
      }
    }
  }
  console.log(`== After round ${amountOfRounds} ==`);
  count.map((num, i) =>
    console.log(`Monkey ${i} inspected items ${num} times.`)
  );
  count.sort((a, b) => b - a);
  console.log(
    `After ${chalk.magentaBright.bold(
      amountOfRounds
    )} rounds, the two most active monkeys inspected items ${chalk.magentaBright.bold(
      count[0]
    )} and ${chalk.magentaBright.bold(count[1])} times.`
  );
  console.log(
    `Multiplying these together, the level of monkey business in this situation is now ${chalk.magentaBright.bold(
      count[0] * count[1]
    )}.`
  );
  return count[0] * count[1];
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

solveDay({ part: 2, test: 1 });
