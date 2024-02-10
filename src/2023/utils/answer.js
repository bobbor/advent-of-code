const { humanTime } = require("./helper");
const { hilite, green, red, cyan, dim, blue } = require("./out");

class AnsweringMachine {
  #wrong;
  #right;
  #task;

  constructor (task, { allRight, allWrong, test }) {
    if (typeof task !== "number") {
      throw new Error("please provide task as number (1 or 2)");
    }
    const w = allWrong[`task${task}`];
    if (w) {
      this.#wrong = (test ? w[`test${test}`] : w.task) ?? [];
    } else {
      this.#wrong = [];
    }
    const r = allRight[`task${task}`];
    if (r) {
      this.#right = test ? r[`test${test}`] : r.task;
    }
    this.#task = `task ${task}${test ? `[${test}]` : ""}`;
  }
  check (guess, ts) {
    let str = `your guess to ${hilite`${this.#task}`}${
      ts
        ? ` took ${blue([humanTime(ts, { ms: true, padded: false })])} and`
        : ""
    } is ${hilite`${guess}`}`;
    const wrong = this.#wrong.find(({ value }) => value === guess);
    const markers = [];
    let ret;
    if (wrong) {
      str = `${str} ${red`✖`}`;
      if (wrong.diff) {
        if (wrong.diff === "too high") {
          markers.push(cyan`⇣`);
        } else if (wrong.diff === "too low") {
          markers.push(cyan`⇡`);
        }
      }
      if (this.#right) {
        markers.push(green`${dim`${this.#right}`}`);
      }
      ret = false;
    } else if (this.#right) {
      if (this.#right === guess) {
        str = `${str} ${green`√`}`;
        ret = true;
      } else {
        str = `${str} ${red`✖`}`;
        markers.push(green`${dim`${this.#right}`}`);
        if (this.#right < guess) {
          markers.push(cyan`⇣`);
        } else {
          markers.push(cyan`⇡`);
        }
        markers.push(dim` ${(100 * Math.abs(this.#right - guess) / Math.abs(this.#right)).toFixed(0)}%off`);
        ret = false;
      }
    }
    console.log(`${str}${markers.length ? `|${markers.join("")}` : ""}`);
    return ret;
  }
}

const mkSolution = () => {
  const allWrong = {
    task1: {},
    task2: {}
  };
  const allRight = {
    task1: {},
    task2: {}
  };

  return {
    wrong (task, value, opts = {}) {
      opts = Object.assign({ test: null }, opts);
      if (typeof value === "number") {
        value = { value };
      }
      if (Array.isArray(value)) {
        value = { value: value[0], diff: value[1] };
      }
      const _task = `task${task}`;
      const _test = opts.test ? `test${opts.test}` : "task";
      const t = allWrong[_task][_test];
      if (!t) {
        allWrong[_task][_test] = [];
      }
      allWrong[_task][_test].push(value);
      return this;
    },
    right (task, value, opts = {}) {
      opts = Object.assign({ test: null }, opts);
      allRight[`task${task}`][opts.test ? `test${opts.test}` : "task"] = value;
      return this;
    },
    build (opts = {}) {
      const { task, test } = Object.assign({ test: null, task: 1 }, opts);
      return new AnsweringMachine(task, {
        allRight,
        allWrong,
        test
      });
    }
  };
};

class AnswerBuilder {
  #solutions;
  constructor () {
    console.warn("dont use the AnswerBuilder anymore. use mkSolution");
    this.#solutions = mkSolution();
  }
  addWrongAnswer (task, guess, opts) {
    this.#solutions = this.#solutions.wrong(task, guess, opts);
  }
  addRightAnswer (task, guess, opts) {
    this.#solutions = this.#solutions.right(task, guess, opts);
  }
  build (task, opts) {
    return this.#solutions.build(task, opts);
  }
}

module.exports = {
  AnswerBuilder,
  mkSolution
};
