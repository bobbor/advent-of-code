const { read } = require("../utils/file");

const readSchematics = async () => {
  const data = await read(__dirname, { removeEmptyLines: true });
  return data.split('\n');
};

const getNumberPositions = (data) => {
  const out = data.map((row, index) => {
    const matches = []
    const re = /([0-9]+)/g;
    for(let match = re.exec(row); match !== null; match = re.exec(row)) {
      matches.push({n: parseInt(match[0], 10), row: index, colStart: match.index, colEnd: match.index + match[0].length - 1})
    }
    return matches
  }).flat()
  return out;
};

const getValidNumbers = (numbers, data) => {
  return numbers.reduce((acc, {n, row, colStart, colEnd}) => {
    let cs = colStart - 1;
    let ce = colEnd + 1;
    if(colStart === 0) {
      cs = 0;
    } else {
      // check for character left of number
      const char = data[row][cs];
      if(char !== '.') {
        if(char === '*') {
          acc.push({n, gear: [row, cs]});
        } else {
          acc.push({n});
        }
        return acc;
      }
    }
    if(colEnd === data[0].length-1) {
      ce = colEnd;
    } else {
      // check for character right of number
      const char = data[row][ce];
      if(char !== '.') {
        if(char === '*') {
          acc.push({n, gear: [row, ce]});
        } else {
          acc.push({n});
        }
        return acc;
      }
    }
    
    // get row above number
    const rs = row - 1
    if(rs >= 0) {
      const aboverow = data[rs];
      const above = aboverow.substring(cs, ce + 1);
      if(!/^\.+$/g.test(above)) {
        const gear = /\*{1}/g.exec(above);
        if(gear) {
          acc.push({n, gear: [rs, cs + gear.index]})
        } else {
          acc.push({n});
        }
        return acc;
      }
    }
    // get row below number
    const re = row + 1
    if(re < data.length) {
      const belowrow = data[re];
      const below = belowrow.substring(cs, ce + 1)
      if(!/^\.+$/g.test(below)) {
        const gear = /\*{1}/g.exec(below);
        if(gear) {
          acc.push({n, gear: [re, cs + gear.index]})
        } else {
          acc.push({n});
        }
        return acc;
      }
    }
    return acc;
  }, [])
}

(async () => {
  const data = await readSchematics();
  const numbers = getNumberPositions(data)
  const valid = getValidNumbers(numbers, data);
  const sum = valid.reduce((acc, {n}) => acc + n, 0)
  console.log('the sum in the engine schematic is:', sum)

  // filter out numbers, which have no gear
  const geared = valid.filter(({gear}) => gear);
  
  // map the geared numbers to pairs
  // meaning: adjacent to the same gear
  const pairs = geared.reduce((acc, {n, gear}) => {
    const k = gear.join(':');
    if(!(k in acc.i)) {
      acc.i[k] = acc.v.length
      acc.v[acc.i[k]] = []
    }
    acc.v[acc.i[k]].push(n)
    return acc;
  }, {i: {}, v: []}).v
  // filter out those which have no other number
  .filter((p) => p.length === 2)

  // calculate the ratio
  const ratio = pairs.reduce((acc, [a, b]) => acc + a*b, 0)
  console.log('the gear ratio is', ratio)
})();