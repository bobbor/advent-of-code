const { read } = require('../utils/file')

const RED = 0;
const GREEN = 1;
const BLUE = 2;
const cubes = [12, 13, 14];

const testForColor = (outcome, color) => {
  for(let o of outcome) {
    if((new RegExp(`${color}$`)).test(o.trim())) {
      return parseInt(o.replace('color', '').trim(), 10);
    }
  }
  return 0;
}

const readGame = async () => {
  const raw = await read(__dirname);
  return raw.split('\n').map(str => {
    const [, games] = str.split(':')
    const outcomes = games.split(';');
    const results = outcomes.map(outcome => {
      const values = outcome.split(',')
      const out = [0,0,0];
      out[RED] = testForColor(values, 'red')
      out[GREEN] = testForColor(values, 'green')
      out[BLUE] = testForColor(values, 'blue')
      return out;
    })
    return results;
  })
}

const getPossibleGameSum = (results) => {
  return results.reduce((acc, games, idx) => {
    let possible = true;
    possibleloop:
    for(let game of games) {
      if(game[RED] > cubes[RED] || game[GREEN] > cubes[GREEN] || game[BLUE] > cubes[BLUE]) {
        possible = false
        break possibleloop;
      }
    }
    if(possible) {
      acc += (idx+1)
    }
    return acc;
  }, 0)
}

const getMinAmountOfCubes = (results) => {
  return results.map(games => {
    const minCubes = [0,0,0];
    for(let game of games) {
      if(game[RED] > minCubes[RED]) {
        minCubes[RED] = game[RED];
      }
      if(game[GREEN] > minCubes[GREEN]) {
        minCubes[GREEN] = game[GREEN];
      }
      if(game[BLUE] > minCubes[BLUE]) {
        minCubes[BLUE] = game[BLUE]
      }
    }
    return minCubes;
  })
}

(async () => {
  const results = await readGame({ test: false });
  //const possibleGameSum = getPossibleGameSum(results)
  //console.log(possibleGameSum)
  const minCubes = getMinAmountOfCubes(results)
  const power = minCubes.map(([r,g,b]) => r*g*b);
  const sum = power.reduce((acc, i) => acc+i, 0)
  console.log('the power of the min cubes is', sum)
})()
