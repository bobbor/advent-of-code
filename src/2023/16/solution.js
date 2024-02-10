const { read } = require("../utils/file");
const { mkSolution } = require("../utils/answer");
const { Area } = require("../utils/area");
const { arrmax } = require("../utils/helper");

/* CONSTANTS*/
const direction = {
  RIGHT: "RIGHT",
  UP: "UP",
  LEFT: "LEFT",
  DOWN: "DOWN",
};

const items = {
  SPACE: ".",
  VSPLITTER: "|",
  HSPLITTER: "-",
  MIRROR1: "\\",
  MIRROR2: "/",
};

const slow = (ctx, options) => {
  let conditionFn, iterationFn;
  const api = {
    while: (fn) => {
      conditionFn = fn;
      return api;
    },
    do: (fn) => {
      iterationFn = fn;
      return api;
    },
    build: () => {
      let timer;

      if (!conditionFn || !iterationFn) {
        throw new Error("cannot build without do and while");
      }

      const loop = () => {
        if (conditionFn(ctx)) {
          ctx = iterationFn(ctx);
          timer = setTimeout(loop, options.timer);
        }
      };

      return {
        start: () => {
          loop();
        },
        stop: () => {
          clearTimeout(timer);
        },
      };
    },
  };

  return api;
};
/*
 * function which holds all right or wrong solutions
 */
const solution = () => {
  return mkSolution()
    .right(1, 46, { test: 1 })
    .right(2, 51, { test: 1 })
    .right(2, 8239)
    .right(1, 7996);
  //.wrong(2, { value: 107792, diff: "too low" })
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
const parseInput = (content) => {
  const raw = content.split("\n").map((line) => line.split(""));
  const area = new Area(raw);
  return area;
};

/*
 * read content of input file(s)
 */
const readInput = async (opts) => {
  const content = await read(__dirname, opts);
  return parseInput(content);
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/*
 * run part 1 specific logic here
 */

const mkWalker = (area, _pos, _dir) => {
  let ended = false;
  let pos = [..._pos];
  const allPositions = [pos];
  let dir = `${_dir}`;

  const move = (pos, dir) => {
    let newPos;
    if (dir === direction.RIGHT) {
      newPos = [pos[0], pos[1] + 1];
    } else if (dir === direction.LEFT) {
      newPos = [pos[0], pos[1] - 1];
    } else if (dir === direction.UP) {
      newPos = [pos[0] - 1, pos[1]];
    } else {
      newPos = [pos[0] + 1, pos[1]];
    }
    //allPositions.push(newPos);
    return newPos;
  };

  const state = (dir, char) => ({
    right: dir === direction.RIGHT,
    left: dir === direction.LEFT,
    up: dir === direction.UP,
    down: dir === direction.DOWN,
    space: char === items.SPACE,
    vsplit: char === items.VSPLITTER,
    hsplit: char === items.HSPLITTER,
    m1: char === items.MIRROR1,
    m2: char === items.MIRROR2,
  });

  return {
    get positions() {
      return allPositions.map(([r, c]) => `${r}.${c}`);
    },
    get ended() {
      return ended;
    },
    walk: () => {
      const { right, left, up, down, vsplit, hsplit, m1, m2 } = state(
        dir,
        area.at(pos)
      );

      if (
        (right && vsplit) ||
        (left && vsplit) ||
        (up && hsplit) ||
        (down && hsplit)
      ) {
        // we split here
        // we end.
        // no more moving
        ended = true;
        return {
          splits: [
            {
              pos,
              dir: vsplit ? direction.UP : direction.LEFT,
            },
            {
              pos,
              dir: vsplit ? direction.DOWN : direction.RIGHT,
            },
          ],
        };
      }
      // m1 is \
      if (m1 && right) dir = direction.DOWN;
      else if (m1 && up) dir = direction.LEFT;
      else if (m1 && left) dir = direction.UP;
      else if (m1 && down) dir = direction.RIGHT;
      // m2 is /
      else if (m2 && right) dir = direction.UP;
      else if (m2 && up) dir = direction.RIGHT;
      else if (m2 && left) dir = direction.DOWN;
      else if (m2 && down) dir = direction.LEFT;
      pos = move(pos, dir);
      if (
        pos[0] >= area.height ||
        pos[0] < 0 ||
        pos[1] < 0 ||
        pos[1] >= area.width
      ) {
        // we are out of bounds
        //  to walk
        ended = true;
      } else {
        allPositions.push(pos);
      }

      return {
        splits: undefined,
      };
    },
  };
};

const mkWalkers = (area, startPos = [0, 0], startDir = direction.RIGHT) => {
  const seenWalkers = {};
  const newWalker = (pos, dir) => {
    const k = `${pos.join(",")}:${dir}`;
    if (k in seenWalkers) {
      return undefined;
    }
    seenWalkers[k] = mkWalker(area, pos, dir);
    return seenWalkers[k];
  };
  const walkers = [newWalker(startPos, startDir)];
  let active = walkers;
  let steps = 0;

  return {
    done: () => {
      return active.length === 0;
    },
    walkThem: () => {
      steps += active.length;
      active.forEach((w) => {
        const { splits } = w.walk();
        if (splits) {
          splits.forEach(({ pos, dir }) => {
            const walker = newWalker(pos, dir);
            if (walker) {
              walkers.push(walker);
            }
          });
        }
      });
      active = walkers.filter((w) => !w.ended);
    },
    get steps() {
      return steps;
    },
    get surface() {
      const positions = [];
      Object.values(seenWalkers).forEach((walker) => {
        for (const position of walker.positions) {
          if (positions.includes(position)) {
            continue;
          }
          positions.push(position);
        }
      });
      return positions;
    },
  };
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Part 1                                                    *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
const solvePart1 = (area) => {
  const walkers = mkWalkers(area);
  while (!walkers.done()) {
    walkers.walkThem();
  }
  return walkers.surface.length;
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/*
 * run part 2 specific logic here
 */

const mkAllWalkers = (area) => {
  const walkers = [];
  for (let c = 0; c < area.width; c++) {
    [
      [0, direction.DOWN],
      [area.height - 1, direction.UP],
    ].forEach(([r, dir]) => {
      walkers.push(mkWalkers(area, [r, c], dir));
    });
  }
  for (let r = 0; r < area.height; r++) {
    [
      [0, direction.RIGHT],
      [area.height - 1, direction.LEFT],
    ].forEach(([c, dir]) => {
      walkers.push(mkWalkers(area, [r, c], dir));
    });
  }
  return walkers;
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Part 2                                                    *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
const solvePart2 = (area) => {
  const walkers = mkAllWalkers(area);

  let active = walkers.filter((w) => !w.done());
  do {
    active.forEach((w) => {
      w.walkThem();
    });
    active = walkers.filter((w) => !w.done());
  } while (active.length);
  walkers.sort((a, b) => b.steps - a.steps);

  let max = Math.max();
  for (let i = 0; i < walkers.length; i++) {
    const w = walkers[i];
    if (w.steps < max) {
      break;
    }
    max = Math.max(max, w.surface.length);
  }
  return max;
};

/*
 * main function
 *
 * You shouldn't need to touch me
 */
const solveDay16 = async (which) => {
  const { part: task, ...test } = which;
  const input = await readInput(test);
  const guess = solution().build(task, test);

  let result,
    startTs = performance.now(),
    end;
  switch (task) {
    case 1:
      result = solvePart1(input);
      end = performance.now() - startTs;
      break;
    case 2:
      result = solvePart2(input);
      end = performance.now() - startTs;
      break;
  }
  guess.check(result, end);
};

solveDay16({ part: 2 });
