const { read } = require("../utils/file");
const { arrmin, pad, humanTime } = require("../utils/helper");

const readFile = async (opts) => {
  const content = await read(__dirname, opts);
  return content.split("\n");
};

/*
 * API design
 * const converter = almanac.from('seeds').to('location');
 * converter([1,2,3,...])
 */

const mkAlmanac = (map) => {
  let _from, _to;

  const mkConverter = () => {
    const keys = Object.keys(map);
    let found = false;
    let from = _from;
    let to = _to;
    const order = [];
    do {
      const k = keys.find((k) => new RegExp(`^${from}:`).test(k));
      if (!k) {
        throw new Error(`no key starts with ${from}`);
      }
      [, from] = k.split(":");
      found = from === to;
      order.push((num) => {
        for (let i = 0; i < map[k].length; i++) {
          let [d, s, r] = map[k][i];
          if (num < s) {
            continue;
          }
          if (num >= s + r) {
            continue;
          }
          return d + (num - s);
        }
        return num;
      });
    } while (!found);
    return (num) => {
      if (Array.isArray(num)) {
        throw new Error("only single seeds");
      }
      const out = order.reduce((acc, fn) => {
        return fn(acc);
      }, num);

      return out;
    };
  };
  const api = {
    from: (start) => {
      _from = start;
      if (_from && _to) {
        return mkConverter();
      }
      return api;
    },
    to: (end) => {
      _to = end;
      if (_from && _to) {
        return mkConverter();
      }
      return api;
    },
  };
  return api;
};
const parseContent = (data) => {
  const [, acc] = data.reduce(
    ([k, acc], mapping) => {
      const naming = /([a-z]+)\-to\-([a-z]+)\ map/.exec(mapping);
      if (naming !== null) {
        k = `${naming[1]}:${naming[2]}`;
        if (!(k in acc)) {
          acc[k] = [];
        }
        return [k, acc];
      } else {
        const inner = acc[k];
        const [d, s, r] = mapping.split(" ").map((_) => parseInt(_));
        acc[k] = [...inner, [d, s, r]];
        return [k, acc];
      }
    },
    [undefined, {}]
  );
  return acc;
};

(async () => {
  const [seedStr, ...statements] = await readFile();
  const map = parseContent(statements);
  const almanac = mkAlmanac(map);
  const converter = almanac.from("seed").to("location");
  const [, seeds] = seedStr.split(":");
  const parsedSeeds = seeds
    .split(" ")
    .filter((_) => _)
    .map((_) => parseInt(_.trim()));
  const tuple1 = [];
  const tuple2 = [];
  // do task 1
  for (let i = 0; i < parsedSeeds.length; i++) {
    tuple1.push([parsedSeeds[i], 1]);
  }
  for (let i = 0; i < parsedSeeds.length; i += 2) {
    tuple2.push([parsedSeeds[i], parsedSeeds[i + 1]]);
  }

  const amount1 = tuple1.reduce((acc, [, r]) => (acc += r), 0);
  const amount2 = tuple2.reduce((acc, [, r]) => (acc += r), 0);

  let c1 = 1;
  let min1 = Math.min();
  for (const [s, r] of tuple1) {
    for (let i = s; i < s + r; i++) {
      console.log(
        `\u001b[1Astep ${c1} of ${amount1} (${pad(
          Math.round((10000 * c1) / amount1) / 100,
          3,
          " "
        )}%) - ${min1}           `
      );
      c1++;
      min1 = Math.min(min1, converter(i));
    }
  }
  console.log(`solution to 1 is ${min1}\n`);
  let c2 = 1;
  let min2 = Math.min();
  for (const [s, r] of tuple2) {
    for (let i = s; i < s + r; i++) {
      console.log(
        `\u001b[1Astep ${c2} of ${amount2} (${pad(
          Math.round((10000 * c2) / amount2) / 100,
          3,
          " "
        )}%) - ${min2}           `
      );
      c2++;
      min2 = Math.min(min2, converter(i));
    }
  }

  console.log(`solution to 2 is ${min2}`);
})();
