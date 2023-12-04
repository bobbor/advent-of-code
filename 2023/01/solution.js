// https://adventofcode.com/2023/day/1
const { read } = require('../utils/file')

const getNumber = (str, fromfront) => {
  if(!str.length) { throw new Error('pass str');}
  const group = '([0-9]|one|two|three|four|five|six|seven|eight|nine)';
  let re
  if(fromfront) {
      re = new RegExp(`^${group}`)
  } else {
      re = new RegExp(`${group}$`);
  }
  if(re.test(str)) {
      str = str.replace(re, ($1) => {
      switch($1) {
          case 'one': return 1;
          case 'two': return 2;
          case 'three': return 3;
          case 'four': return 4;
          case 'five': return 5;
          case 'six': return 6;
          case 'seven': return 7;
          case 'eight': return 8;
          case 'nine': return 9;
          default: return $1
      }
      })
      if(fromfront) {
          return str[0]
      }
      return str[str.length-1]
  }
  if(fromfront) {
      str = str.slice(1)
  } else {
      str = str.slice(0, str.length -1)
  }
  return getNumber(str, fromfront)
}

const getCodes = async () => {
  const rawcodes = await read(__dirname);
  return rawcodes.split('\n')
}
(async () => {
  const codes = await getCodes();
  const numbers = codes.map(code => {
    const first = getNumber(code, true);
    const last = getNumber(code, false);
    const out = parseInt(`${first}${last}`, 10)
    return out
  });
  const sum = numbers.reduce((s, n) => s+n, 0);
  console.log('the sum is:', sum)
})()
