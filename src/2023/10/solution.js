const { read } = require("../utils/file");

//const tests = [1, 2, "2a", 3, "3a", 4, 5];
const tests = [];
const mkAnswer = (test) => {
  const answers = {
    q1: {
      test: {
        1: { right: 4 },
        2: { right: 8 },
        "2a": { right: 8 },
        3: { right: 23 },
        "3a": { right: 22 }

      },
      full: { right: 7012 }
    },
    q2: {
      test: {
        1: { right: 1 },
        2: { right: 1 },
        "2a": { right: 1 },
        3: { right: 4 },
        "3a": { right: 4 },
        4: { right: 8 },
        5: { right: 10 }
      },
      full: { right: 395, wrong: [] }
    }
  };
  const guesses = {
    q1: undefined,
    q2: undefined
  };
  return {
    for: (question, guess) => {
      guesses[question] = guess;
    },
    tellMe: () => {
      for (const [question, result] of Object.entries(guesses)) {
        if (result === undefined) {
          console.log(`${question}: no result as it is undefined`);
          return;
        }
        const answersForQuestion = answers[question];
        const answer = test ? answersForQuestion.test[test] : answersForQuestion.full;
        const correct = answer
          ? answer.right
            ? result === answer.right
            : answer.wrong
              ? answer.wrong.includes(result)
                ? false
                : undefined
              : undefined
          : undefined;
        console.log(`${question}: ${result} ${correct !== undefined ? `${correct ? "✅ " : `❌ ${answer?.right && `(${answer.right})`}`}` : "🤷 "}`);
      }
    }
  };
};
const up = "UP", right = "RIGHT", down = "DOWN", left = "LEFT";
const v = "│";
const h = "─";
const bottom_left = "└";
const top_left = "┌";
const top_right = "┐";
const bottom_right = "┘";

const sChar = (() => {
  const assoc = [
    [down, left, top_right],
    [down, up, v],
    [down, right, top_left],
    [left, right, h],
    [left, up, bottom_right],
    [right, up, bottom_left]
  ];
  return (_from, _to) => {
    const [from, to] = [_from, _to].sort();
    const el = assoc.find(([f, t]) => from === f && t === to);
    return el[2];
  };
})();

const me = "S";

const navigate = {
  [up]: {
    [v]: up,
    [top_left]: right,
    [top_right]: left
  },
  [right]: {
    [h]: right,
    [top_right]: down,
    [bottom_right]: up
  },
  [down]: {
    [v]: down,
    [bottom_right]: left,
    [bottom_left]: right
  },
  [left]: {
    [h]: left,
    [bottom_left]: up,
    [top_left]: down
  }
};

const getData = async (opts) => {
  const plan = await read(__dirname, opts);
  return plan
    .split("\n")
    .map(line => line.split(""));
};
const mkPlan = (raw) => {
  let startPos;
  const plan = {
    set start (pos) {
      startPos = pos;
    },
    get start () {
      if (startPos) {
        return startPos;
      }
      for (let i = 0; i < raw.length; i++) {
        for (let j = 0; j < raw[i].length; j++) {
          if (raw[i][j] === me) {
            return [i, j];
          }
        }
      }
    },
    valid: ([r, c]) => 0 <= r && r < raw.length && 0 <= c && c < raw[r].length,
    at: ([r, c]) => raw[r][c],
    same: ([r1, c1], [r2, c2]) => r1 === r2 && c1 === c2,
    set ([r, c], char) {
      raw[r][c] = char;
    },
    get width () {
      return raw.length;
    },
    get height () {
      if (plan.width === 0) {
        return 0;
      }
      return raw[0].length;
    },
    [Symbol.iterator] () {
      let r = 0, c = -1;
      return {
        next () {
          c++;
          if (c === raw[r].length) {
            c = 0;
            r++;
          }
          if (r === raw.length) {
            return { done: true, value: { pos: [r - 1, c], v: raw[r - 1][c] } };
          }
          return { done: false, value: { pos: [r, c], v: raw[r][c] } };
        },
        return () {
          return { done: true };
        }
      };
    }
  };

  return plan;
};
const mkWalker = (plan) => {
  const start = plan.start;
  const go = (dir, [r, c]) => {
    switch (dir) {
      case up: {
        const pos = [r - 1, c];
        if (plan.valid(pos)) {
          return pos;
        }
        throw new Error(`cannot go up ${[r, c]}`);
      }
      case down: {
        const pos = [r + 1, c];
        if (plan.valid(pos)) {
          return pos;
        }
        throw new Error(`cannot go down ${[r, c]}`);
      }
      case left: {
        const pos = [r, c - 1];
        if (plan.valid(pos)) {
          return pos;
        }
        throw new Error(`cannot go left ${[r, c]}`);
      }
      case right: {
        const pos = [r, c + 1];
        if (plan.valid(pos)) {
          return pos;
        }
        throw new Error(`cannot go right ${[r, c]}`);
      }
    }
  };
  return {
    walk: () => {

      let directions = [];
      let pos = start;
      let steps = 0;
      let char = "";
      let pipePositions = [];

      /* find out where we can go */
      for (const dir of [up, right, down, left]) {
        try {
          const newpos = go(dir, start);
          const c = plan.at(newpos);
          if (Object.keys(navigate[dir]).includes(c)) {
            directions.push(dir);
          }
        } catch (e) {
        }
      }
      if (!directions.length) {
        throw Error("found nowhere to go");
      }

      plan.set(start, sChar(...directions));
      for (const from of [left, up, right, down]) {
        for (const to of [left, up, right, down]) {
          if (from === to) { continue; }

        }
      }

      let dir = directions[0];
      // found a direction, let's goo
      do {
        pipePositions.push(pos);
        // go in that direction
        pos = go(dir, pos);
        // mark it as a step taken
        steps++;
        // on which char we stand now?
        char = plan.at(pos);
        dir = navigate[dir][char];
      } while (!plan.same(start, pos));
      return { steps, pipe: pipePositions };
    }
  };
};
const mkCage = (plan, pipe) => {
  const getPipePosOnRow = (r) => {
    return pipe
      .filter(([_r]) => _r === r)
      .map(([, c]) => c)
      .sort((a, b) => a - b);
  };
  const getPipePosOnColumn = (c) => {
    return pipe
      .filter(([, _c]) => _c === c)
      .map(([r]) => r)
      .sort((a, b) => a - b);
  };
  const isPosPotentiallyEnclosed = (pos) => {
    const rowFields = getPipePosOnRow(pos[0]);
    const colFields = getPipePosOnColumn(pos[1]);
    const left = rowFields.filter(num => num < pos[1]);
    const right = rowFields.filter(num => num > pos[1]);
    const top = colFields.filter(num => num < pos[0]);
    const bottom = colFields.filter(num => num > pos[0]);
    if (left.length === 0) {
      return false;
    }
    if (right.length === 0) {
      return false;
    }
    if (top.length === 0) {
      return false;
    }
    return bottom.length !== 0;

  };

  const isEnclosed = (pos) => {
    const rowFields = getPipePosOnRow(pos[0]);
    const colFields = getPipePosOnColumn(pos[1]);
    let wewanttogo = undefined;
    const left = rowFields.filter(num => num < pos[1]);
    let leftCount = 0;
    let i;
    for (i = left.length - 1; i >= 0; i--) {
      const position = [pos[0], left[i]];
      const char = plan.at(position);
      if (!wewanttogo && (char === bottom_right || char === top_right)) {
        wewanttogo = char === bottom_right ? down : up;
        continue;
      }
      if (wewanttogo && char !== h) {
        if (wewanttogo === down && char === top_left) {
          leftCount += 1;
        } else if (wewanttogo === up && char === bottom_left) {
          leftCount += 1;
        }
        wewanttogo = undefined;
      } else if (char === v) {
        leftCount += 1;
      }
    }
    wewanttogo = undefined;
    const right = rowFields.filter(num => num > pos[1]);
    let rightCount = 0;
    for (i = 0; i < right.length; i++) {
      const position = [pos[0], right[i]];
      const char = plan.at(position);
      if (!wewanttogo && (char === top_left || char === bottom_left)) {
        wewanttogo = char === bottom_left ? down : up;
        continue;
      }
      if (wewanttogo && char !== h) {
        if (wewanttogo === down && char === top_right) {
          rightCount += 1;
        } else if (wewanttogo === up && char === bottom_right) {
          rightCount += 1;
        }
        wewanttogo = undefined;
      } else if (char === v) {
        rightCount += 1;
      }
    }
    if (!(leftCount % 2) && !(rightCount % 2)) {
      return false;
    }
    if ((leftCount + rightCount) % 2) {
      return false;
    }

    wewanttogo = undefined;
    const top = colFields.filter(num => num < pos[0]);
    let topCount = 0;
    for (i = top.length - 1; i >= 0; i--) {
      const position = [top[i], pos[1]];
      const char = plan.at(position);
      if (!wewanttogo && (char === bottom_right || char === bottom_left)) {
        wewanttogo = char === bottom_left ? right : left;
        continue;
      }
      if (wewanttogo && char !== v) {
        if (wewanttogo === left && char === top_left) {
          topCount += 1;
        } else if (wewanttogo === right && char === top_right) {
          topCount += 1;
        }
        wewanttogo = undefined;
      } else if (char === h) {
        topCount += 1;
      }
    }
    const bottom = colFields.filter(num => num > pos[0]);
    let bottomCount = 0;

    for (i = 0; i < bottom.length; i++) {
      const position = [bottom[i], pos[1]];
      const char = plan.at(position);
      if (!wewanttogo && (char === top_right || char === top_left)) {
        wewanttogo = char === top_left ? right : left;
        continue;
      }
      if (wewanttogo && char !== v) {
        if (wewanttogo === left && char === bottom_left) {
          bottomCount += 1;
        } else if (wewanttogo === right && char === bottom_right) {
          bottomCount += 1;
        }
        wewanttogo = undefined;
      } else if (char === h) {
        bottomCount += 1;
      }
    }
    if (!(topCount % 2) && !(bottomCount % 2)) {
      return false;
    }
    if ((topCount + bottomCount) % 2) {
      return false;
    }
    return true;
  };
  return {
    check: () => {
      const planSize = plan.height * plan.width;
      const pipeSize = pipe.length;
      console.log("plan size", planSize, "pipe size ", pipeSize);
      console.log("fields not part of pipe", planSize - pipeSize);
      let enclosed = 0;
      const potentialFields = [];
      const fields = [];
      for (const { pos } of plan) {
        if (pipe.some(p => plan.same(p, pos))) {
          continue;
        }
        if (isPosPotentiallyEnclosed(pos)) {
          potentialFields.push(pos);
        }
      }
      console.log("edges ruled out leaves us", potentialFields.length);
      for (const pos of potentialFields) {
        if (isEnclosed(pos)) {
          enclosed += 1;
          fields.push(pos);
        }
      }
      return { enclosed, fields };
    }
  };
};

(async () => {
  const calc = async (test) => {
    console.log(test ? `test no.${test}` : "input");
    const answer = mkAnswer(test);
    const rawPlan = await getData(test ? { test } : {});
    const plan = mkPlan(rawPlan);
    const walker = mkWalker(plan);
    const { steps, pipe } = walker.walk();
    const farthest = Math.floor(steps / 2);
    answer.for("q1", farthest);
    const cage = mkCage(plan, pipe);
    const { enclosed, fields } = cage.check();
    answer.for("q2", enclosed);
    answer.tellMe();
    console.log();
  };
  if (tests.length) {
    for (const test of tests) {
      await calc(test);

    }
  } else {
    await calc();
  }
})();