const { read } = require('../utils/file');

const readData = async (test) => {
  const d = await read(__dirname, { removeEmptyLines: true, ...(test ? {test: 1} :{})});
  return d.split('\n')
}

const parseData = (data) => {
  return data.map(line => {
    const [, numbers] = line.split(':')
    const [_winning, _scratched] = numbers.split('|')
    const winning = _winning.split(' ').map(_ => _.trim()).filter(_ => _);
    const scratched = _scratched.split(' ').map(_ => _.trim()).filter(_ => _);
    return {winning, scratched};
  });
}

const checkForWinningNumbers = (parsed) => {
  return parsed.map(({winning, scratched}) => {
    let c = 0
    for(let num of scratched) {
      if(winning.includes(num)) {
        c++;
      }
    }
    return c;
  });
}

const calculatePoints = (winners) => {
  let points = 0;
  for(let winner of winners) {
    if(!winner) { continue; }
    points += Math.pow(2, winner-1);
  }
  return points;
}

const winMoreCards = (winners) => {
  let stack = Array.from(winners).map(() => 1);
  for(let i = 0; i < winners.length; i++) {
    const winner = winners[i];
    for(let j = 1; j <= winner; j++) {
      if(i+j < stack.length) {
        stack[i+j] += stack[i];
      }
    }
  }
  return stack.reduce((a,_) => a+_, 0);
}

(async () => {
  const data = await readData();
  const parsed = parseData(data);
  const winners = checkForWinningNumbers(parsed);
  const points = calculatePoints(winners);
  console.log(`you have ${points} points`)
  const pile = winMoreCards(winners);
  console.log("but that's the wrong rules.");
  console.log("actually")
  console.log(`you have won ${pile} cards`)
})()