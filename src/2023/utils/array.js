/*
 * walks through an array.
 * returns all 2-element tuples of possible combinations
 */
const getPermutations = (arr) => {
  const ret = [];
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      ret.push([arr[i], arr[j]]);
    }
  }
  return ret;
};

module.exports = {
  getPermutations,
};
