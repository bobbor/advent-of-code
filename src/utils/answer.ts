import chalk from "chalk";
import { humanTime } from "./helper";

export interface Task {
  test?: number;
  part: 1 | 2;
}

type Guess = number | string;
type Diff = "too high" | "too low" | undefined;

interface RightGuess {
  guess: Guess;
}

interface WrongGuess extends RightGuess {
  diff: Diff;
}

class AnsweringMachine {
  #wrong: WrongGuess[];
  #right: RightGuess | undefined;
  #task: Task;

  constructor(
    task: Task,
    answers: RightGuess | undefined,
    wrongGuesses: WrongGuess[] = []
  ) {
    this.#task = task;
    this.#wrong = wrongGuesses;
    this.#right = answers;
  }
  #stringifyTask(task: Task, opts: { printTask: boolean; extra?: string }) {
    if (!opts.printTask) {
      return "";
    }
    return `${opts.extra ? `${opts.extra} ` : ""}pt.${task.part}${
      task.test ? ` t.${task.test}` : ""
    }`;
  }
  check(
    guess: Guess,
    ts?: ReturnType<typeof performance.now>,
    titleOpts: { printTask: boolean; extra?: string } = { printTask: false }
  ) {
    const isRight = guess === this.#right?.guess;
    const wrong = this.#wrong.find(({ guess: value }) => value === guess);
    const isWrong = wrong !== undefined;

    const title = chalk.bold(this.#stringifyTask(this.#task, titleOpts));
    let status = "";
    let diff = "";
    let time = "";
    if (isRight) {
      status = chalk.green("√");
    } else if (isWrong) {
      status = chalk.red("✖");
      diff = chalk.yellow(wrong.diff === "too high" ? "⇣" : "⇡");
    } else if (this.#right) {
      status = chalk.red("✖");
      if (typeof this.#right.guess === "number" && typeof guess === "number") {
        diff = chalk.yellow(guess > this.#right.guess ? "⇣" : "⇡");
      } else {
        diff = chalk.yellow("*");
      }
    } else {
      status = chalk.cyan("?");
    }
    if (ts) {
      time = chalk.blue.dim(humanTime(ts, { ms: true, padded: true }));
    }
    console.log(
      `${title ? `${title} ` : ""}${guess} ${status}${diff}${
        time ? ` ${time}` : ""
      }`
    );
  }
}

interface SolutionFactoryAPI {
  wrong: (task: Task, value: Guess, diff: Diff) => SolutionFactoryAPI;
  right: (task: Task, value: Guess) => SolutionFactoryAPI;
  build: () => AnsweringMachine;
}

type SolutionFactory = (task: Task) => SolutionFactoryAPI;

export const mkSolution: SolutionFactory = (task) => {
  const wrongAnswers: Record<string, WrongGuess[]> = {};
  const answers: Record<string, RightGuess> = {}; // aka right guesses
  const str = (task: Task): string =>
    [task.part, ...(task.test ? [task.test] : [])].join(":");
  const k = str(task);

  return {
    wrong(task, value, diff) {
      const k = str(task);
      if (!(k in wrongAnswers)) {
        wrongAnswers[k] = [];
      }
      wrongAnswers[k].push({
        guess: value,
        diff,
      });
      return this;
    },
    right(task, value) {
      const k = str(task);
      answers[k] = { guess: value };
      return this;
    },
    build() {
      const wrongGuesses = wrongAnswers[k];
      const answer = answers[k];
      return new AnsweringMachine(task, answer, wrongGuesses);
    },
  };
};
