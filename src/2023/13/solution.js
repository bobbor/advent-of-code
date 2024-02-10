const { read } = require("../utils/file");
const { mkSolution } = require("../utils/answer");
const { Area } = require("../utils/area");

/*
 * custom logic for Area, parsers, processors goes here
 */

// e.g.
class Board extends Area {
  constructor(raw) {
    super(raw);
  }
  horizontalReflection() {
    rowloop: for (let i = 0; i < this.height - 1; i++) {
      const lower = this.rowStr(i);
      const upper = this.rowStr(i + 1);
      if (lower === upper) {
        const end = Math.min(i, this.height - 2 - i);
        checkloop: for (let j = 1; j <= end; j++) {
          const upper = this.rowStr(i - j);
          const lower = this.rowStr(i + 1 + j);
          if (upper !== lower) {
            continue rowloop;
          }
        }
        return i + 1;
      }
    }
  }
  verticalReflection() {
    colloop: for (let i = 0; i < this.width - 1; i++) {
      const lower = this.colStr(i);
      const upper = this.colStr(i + 1);
      if (lower === upper) {
        const end = Math.min(i, this.width - 2 - i);
        checkloop: for (let j = 1; j <= end; j++) {
          const upper = this.colStr(i - j);
          const lower = this.colStr(i + 1 + j);
          if (upper !== lower) {
            continue colloop;
          }
        }
        return i + 1;
      }
    }
  }
  adjustedHorizontalReflection(h) {
    rowloop: for (let i = 0; i < this.height - 1; i++) {
      let adjusted = false;
      const lower = this.rowStr(i);
      const upper = this.rowStr(i + 1);
      const diff = this.diff(lower, upper);
      if (lower === upper && i === h - 1) {
        continue rowloop;
      }
      if (lower !== upper && diff.length === 1) {
        adjusted = true;
      }
      if (lower === upper || adjusted) {
        const end = Math.min(i, this.height - 2 - i);
        checkloop: for (let j = 1; j <= end; j++) {
          const upper = this.rowStr(i - j);
          const lower = this.rowStr(i + 1 + j);
          const diff = this.diff(lower, upper);
          if (upper !== lower) {
            if (!adjusted && diff.length === 1) {
              adjusted = true;
              continue checkloop;
            }
            continue rowloop;
          }
        }
        return i + 1;
      }
    }
  }
  adjustedVerticalReflection(v) {
    colloop: for (let i = 0; i < this.width - 1; i++) {
      let adjusted = false;
      const lower = this.colStr(i);
      const upper = this.colStr(i + 1);
      const diff = this.diff(lower, upper);
      if (lower === upper && i === v - 1) {
        continue colloop;
      }
      if (lower !== upper && diff.length === 1) {
        adjusted = true;
      }
      if (lower === upper || adjusted) {
        const end = Math.min(i, this.width - 2 - i);
        checkloop: for (let j = 1; j <= end; j++) {
          const upper = this.colStr(i - j);
          const lower = this.colStr(i + 1 + j);
          const diff = this.diff(lower, upper);
          if (upper !== lower) {
            if (!adjusted && diff.length === 1) {
              adjusted = true;
              continue checkloop;
            }
            continue colloop;
          }
        }
        return i + 1;
      }
    }
  }

  diff(entity1, entity2) {
    const d = [];
    for (let i = 0; i < entity1.length; i++) {
      if (entity1[i] !== entity2[i]) {
        d.push(i);
      }
    }
    return d;
  }
  toggle(pos) {
    if (this.at(pos) === "#") {
      this.set(pos, ".");
    } else {
      this.set(pos, "#");
    }
  }
}

/*
 * prepare raw input data for processing
 */
const parseBoards = (content) => {
  return content
    .split("\n")
    .reduce(
      (acc, line) => {
        if (!line) {
          acc.push([]);
          return acc;
        }
        acc[acc.length - 1].push(line.split(""));
        return acc;
      },
      [[]]
    )
    .map((pattern) => new Board(pattern));
};

/*
 * read content of input file(s)
 */
const readBoards = async (opts) => {
  const content = await read(__dirname, opts);
  return parseBoards(content);
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

const getReflections = (board) => {
  const horiz = board.horizontalReflection();
  const vert = board.verticalReflection();
  const hDef = horiz !== undefined;
  const vDef = vert !== undefined;
  return {
    ...(hDef ? { h: horiz } : {}),
    ...(vDef ? { v: vert } : {}),
  };
};

/** solving first part of the task
 */
const solveTask1 = (boards) => {
  let result = 0;
  for (const board of boards) {
    const { v, h } = getReflections(board);
    result += (h ?? 0) * 100 + (!h ? v ?? 0 : 0);
  }
  return result;
};

const getAdjustedReflections = (board, reflections) => {
  const horiz = board.adjustedHorizontalReflection(reflections.h);
  const vert = board.adjustedVerticalReflection(reflections.v);
  const hDef = horiz !== undefined;
  const vDef = vert !== undefined;

  return {
    ...(hDef ? { h: horiz } : {}),
    ...(vDef ? { v: vert } : {}),
  };
};
/* solving second part of the task */
const solveTask2 = (boards) => {
  let result = 0;
  for (const board of boards) {
    const reflections = getReflections(board);
    const { h, v } = getAdjustedReflections(board, reflections);
    result += (h ?? 0) * 100 + (h === undefined ? v ?? 0 : 0);
  }
  return result;
};

const solveDay13 = async (task, test) => {
  const boards = await readBoards({ ...test, removeEmptyLines: false });
  const guess = mkSolution()
    .right(1, 405, { test: 1 })
    .right(1, 31739)
    .right(1, 709, { test: 2 })
    .right(2, 400, { test: 1 })
    .right(2, 1400, { test: 2 })
    .wrong(2, { value: 44391 })
    .wrong(2, { value: 44725 })
    .wrong(2, { value: 18809 })
    .right(2, 31539)
    .build(task, test);

  let result,
    startTs = performance.now(),
    end;
  switch (task) {
    case 1:
      result = solveTask1(boards);
      end = performance.now() - startTs;
      break;
    case 2:
      result = solveTask2(boards);
      end = performance.now() - startTs;
      break;
  }
  guess.check(result, end);
};

solveDay13(2);
