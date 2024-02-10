const { read } = require("../utils/file");
const { AnswerBuilder } = require("../utils/answer");
const { Area } = require("../utils/area");

class Board extends Area {
  static SPACE = ".";
  static ROCK = "#";
  static BOULDER = "O";
  constructor(raw) {
    super(raw);
  }
  tilt({ axis, desc }) {
    let fn, end, set;
    if (axis === "vert") {
      fn = this.col;
      end = this.width;
      set = this.setCol;
    } else {
      fn = this.row;
      end = this.height;
      set = this.setRow;
    }
    fn = fn.bind(this);
    set = set.bind(this);

    for (let idx = 0; idx < end; idx++) {
      const entity = fn(idx).join("");
      const out = entity
        .split("#")
        .map((section) => {
          return section
            .split("")
            .sort((a, b) => {
              if (a === Board.SPACE && b !== Board.SPACE) {
                return desc ? -1 : 1;
              }
              if (a === Board.BOULDER && b !== Board.BOULDER) {
                return desc ? 1 : -1;
              }
              return 0;
            })
            .join("");
        })
        .join("#");
      set(idx, out);
    }
  }
  load() {
    let load = 0;
    for (const col of this.cols) {
      load += col
        .map((item, i) => {
          if (item === Board.BOULDER) {
            return this.height - i;
          }
          return 0;
        })
        .reduce((acc, n) => acc + n, 0);
    }
    return load;
  }
  encode() {
    const ret = [];
    for (let c = 0; c < this.width; c++) {
      const cret = [];
      for (let r = 0; r < this.height; r++) {
        const item = this.at([r, c]);
        if (item !== Board.SPACE) {
          if (item === Board.BOULDER) {
            cret.push(r);
          } else {
            cret.push(`!${r}`);
          }
        }
      }
      ret.push(`${c}:${cret.join(",")}`);
    }
    return ret.join(";");
  }
}

/*
 * take the raw input and make it usable
 */
const parseInput = (content) => {
  const raw = content.split("\n").map((l) => l.split(""));
  return new Board(raw);
};

/*
 * readin the content of the file I need
 */
const readInput = async (opts) => {
  const content = await read(__dirname, opts);
  return parseInput(content);
};

/**
 * solving first part of the task
 */
const solveTask1 = (board) => {
  board.tilt({ axis: "vert", desc: false });
  let load = board.load();
  return load;
};

/**
 * solving second part of the task
 */
const solveTask2 = (board) => {
  let load;
  const results = [];
  const cycle = () => {
    board.tilt({ axis: "vert", desc: false }); // north
    board.tilt({ axis: "horz", desc: false }); // west
    board.tilt({ axis: "vert", desc: true }); // south
    board.tilt({ axis: "horz", desc: true }); // east
  };
  let i = 0,
    rounds = 1_000_000_000;
  while (i < rounds) {
    cycle();
    const enc = board.encode();
    if (results.some(({ encoded }) => encoded === enc)) {
      const offset = results.findIndex(({ encoded }) => encoded === enc);
      const current = i;
      const loopLength = current - offset;
      console.log("current", current);
      const billionthItem = ((rounds - offset) % loopLength) + offset;
      load = results[billionthItem - 1].load;
      break;
    } else {
      results.push({ encoded: enc, load: board.load() });
    }
    i++;
  }
  return load;
};

const solve = async (task, test) => {
  const builder = new AnswerBuilder();
  builder.addRightAnswer(1, 136, { test: 1 });
  builder.addWrongAnswer(1, [103626, "too high"]);
  builder.addRightAnswer(1, 103614);
  builder.addRightAnswer(2, 64, { test: 1 });
  builder.addWrongAnswer(2, [83806, "too high"]);
  builder.addRightAnswer(2, 83790);
  const answer = builder.build(task, test);

  const input = await readInput(test);
  let result, start, duration;
  switch (task) {
    case 1:
      start = performance.now();
      result = solveTask1(input);
      duration = performance.now() - start;
      break;
    case 2:
      start = performance.now();
      result = solveTask2(input);
      duration = performance.now() - start;
      break;
  }
  answer.check(result, duration);
};

solve(1);
