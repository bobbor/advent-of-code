const { read } = require("../utils/file");
const { mkSolution } = require("../utils/answer");

/*
 * function which holds all right or wrong solutions
 */
const solution = () => {
  return mkSolution()
    .right(1, 19114, { test: 1 })
    .right(1, 401674)
    .right(2, 167409079868000, { test: 1 });
  //.wrong(2, { value: 107792, diff: "too low" })
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/*
 * custom logic for Area, parsers, processors goes here
 */

// e.g. 
// class Board extends Area {}

const createMapFn = (mapping, names) => {
  names.sort((a, b) => b.length - a.length);
  const newMapping = mapping.replace(/:/g, "?").replace(/,/g, ":").replace(
    new RegExp(`(${names.join("|")}${names.length ? "|":""}R|A)`, "g"),
    (match, $1) => {
      return `"${$1}"`;
    }
  );
  return Function("{x,m,a,s}", `return ${newMapping}`);
};

/*
 * prepare raw input data for processing
 */
const parseInput = (content) => {
  const [rules, inputs] = content.split("\n\n");
  const names = rules.split("\n").map(r => {
    const { groups: { name } } = /^(?<name>[a-z]+){(?<mapping>.*)}$/.exec(r);
    return name;
  });
  return { names, inputs, rules };

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

const processInputsForPart1 = ({ names, rules, inputs }) => {
  return {
    instructions: rules.split("\n").reduce((acc, r) => {
      const { groups: { name, mapping } } = /^(?<name>[a-z]+){(?<mapping>.*)}$/.exec(r);
      acc[name] = createMapFn(mapping, names);
      return acc;
    }, {}),
    ratings: inputs.split("\n").map(r => {
      return r.replace(/^{/, "").replace(/}$/, "").split(",").reduce((acc, item) => {
        const [k, v] = item.split("=");
        acc[k] = parseInt(v);
        return acc;
      }, {});
    })
  };
};

const processPiece = (instructions, part) => {
  let step = "in";
  do {
    step = instructions[step](part);
  } while (!(step === "A" || step === "R"));
  return step;
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Part 1                                                    *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
const solvePart1 = ({ rules, names, inputs }) => {
  const { instructions, ratings } = processInputsForPart1({ names, rules, inputs });
  return ratings
    .filter(rating => processPiece(instructions, rating) === "A")
    .reduce((acc, { x, m, a, s }) => acc + x + m + a + s, 0);
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/*
 * run part 2 specific logic here
 */

const processInputsForPart2 = ({ names, rules, inputs }) => {
  const instructions = rules.split("\n").reduce((acc, r) => {
    const { groups: { name, mapping } } = /^(?<name>[a-z]+){(?<mapping>.*)}$/.exec(r);
    acc[name] = mapping;
    return acc;
  }, {});
  const keys = Object.keys(instructions).sort((a, b) => b.length - a.length);
  for (let k of keys) {
    if (k === "in") { continue;}
    Object.keys(instructions).forEach((key) => {
      if (key !== k) {
        instructions[key] = instructions[key].replace(new RegExp(k, "g"), instructions[k]);
      }
    });
    delete instructions[k];
  }
  return {
    fn: createMapFn(instructions.in, []),
    raw: instructions.in
  };
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Part 2                                                    *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
const solvePart2 = ({ rules, names, inputs }) => {
  const { raw, fn } = processInputsForPart2({ names, rules, inputs });
  const boundaries = ["x", "m", "a", "s"].reduce((acc, letter) => {
    const statements = [];
    const sRe = new RegExp(`${letter}([<>])([0-9]+)`, "g");
    let match;
    do {
      match = sRe.exec(raw);
      if (match) {
        const n = parseInt(match[2]);
        const sm = match[1] === "<";
        statements.push({
          id: `${letter}${statements.length + 1}`,
          ex: n + (sm ? -1 : 1),
          comp: match[1]
        });
      }
    } while (match !== null);
    acc[letter] = statements;
    return acc;
  }, {});

  const rangeMap = Object.keys(boundaries).reduce((acc, k) => {
    const replica = [];
    for (const val of boundaries[k]) {
      for (let i = 0; i < acc.length; i++) {
        replica.push({ [k]: val, ...acc[i] });
      }
    }
    return replica;
  }, [{}]);
  const filteredRange = rangeMap.filter(({ x, m, a, s }) => fn({ x: x.ex, m: m.ex, a: a.ex, s: s.ex }) === "A");
  Object.keys(boundaries).forEach(k => {
    for (let i = boundaries[k].length; i--;) {
      const { id } = boundaries[k][i];
      if (!filteredRange.some(range => range[k].id === id)) {
        boundaries[k] = [...boundaries[k].slice(0, i), ...boundaries[k].slice(i + 1)];
      }
    }
  });
  filteredRange.reduce();
  // Object.keys(boundaries).forEach(k => {
  //   const rules = boundaries[k].sort((a, b) => a.comp === "<" ? 1 : b.comp === "<" ? -1 : a.ex - b.ex);
  //   const limits = [];
  //   for (let i = 0; i < rules.length; i++) {
  //     const { comp, ex } = rules[i];
  //     if (comp === "<") {
  //       const idx = limits.findIndex(([l, u]) => l < ex && u > ex);
  //       if (idx === -1) {
  //         limits.unshift([0, ex]);
  //       } else {
  //         limits[idx][1] = ex;
  //       }
  //     } else {
  //       limits.push([ex, 4000]);
  //       if (limits.length - 2 >= 0) {
  //         limits[limits.length - 2][1] = ex;
  //       }
  //     }
  //   }
  //   const cleaned = limits.reduce((acc, limit) => {
  //     if (!acc.length) { return [limit];}
  //     if (acc[acc.length - 1][1] === limit[0]) {
  //       acc[acc.length - 1][1] = limit[1];
  //       return acc;
  //     }
  //     acc.push(limit);
  //     return acc;
  //   }, []);
  //   boundaries[k].range = cleaned;
  // });
  //
  // const rangeMap = Object.keys(boundaries).reduce((acc, k) => {
  //   const replica = [];
  //   for (const val of boundaries[k].range) {
  //     for (let i = 0; i < acc.length; i++) {
  //       replica.push({ [k]: { ex: (val[1] + val[0]) / 2, val }, ...acc[i] });
  //     }
  //   }
  //   return replica;
  // }, [{}]);

  // const filteredRange = rangeMap.filter(({ x, m, a, s }) => fn({ x: x.ex, m: m.ex, a: a.ex, s: s.ex }) === "A");
  // let r = 0;
  // for (const { x, m, a, s } of filteredRange) {
  //   let xr = x.val[1] - x.val[0];
  //   let mr = m.val[1] - m.val[0];
  //   let ar = a.val[1] - a.val[0];
  //   let sr = s.val[1] - s.val[0];
  //   r += xr * mr * ar * sr;
  // }
  // return r;
  return 0;
};

/*
 * main function
 * 
 * You shouldn't need to touch me
 */
const solveDay19 = async (options) => {
  const { task, test } = options;
  const input = await readInput({ removeEmptyLines: false, test });
  const guess = solution().build(options);

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

solveDay19({ task: 2, test: 1 });
