const { read } = require('../utils/file')

const readData = async () => {
  const c = await read(__dirname, { removeEmptyLines: false})
  return c.split('\n')
}
(async () => {
  const content = await readData()
  const split = content.reduce((acc, item) => {
    if(!item) {
      acc.push([]);
      return acc;
    }
    acc[acc.length-1].push(parseInt(item, 10));
    return acc;
  }, [[]])

  console.log('each elf carries', split)

  const sums = split.map((nums) => nums.reduce((acc, n) => acc+n, 0))

  console.log('the calorie sum of each is', sums)
  sums.sort((a, b) => {
    return b-a
  });

  console.log('the max of calories carried', sums[0])

  // sum of top three
  console.log('the top three calories are', sums[0]+ sums[1]+ sums[2])
})()