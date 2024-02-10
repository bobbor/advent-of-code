const { read } = require("../utils/file");

const parseData = (data) => {
  const getNumbers = (line) =>
    line
      .split(":")[1]
      .split(" ")
      .filter((_) => _)
      .map((_) => parseInt(_));

  const [time, distance] = data;
  const times = getNumbers(time);
  const distances = getNumbers(distance);
  return times.map((t, i) => [t, distances[i]]);
};
const getData = async (opts) => {
  const content = await read(__dirname, opts);
  return parseData(content.split("\n"));
};

const solveTask1 = (data) => {
  const checkRace = ([time, distance]) => {
    let min = 1;
    // ignore 0
    minloop: for (min; min < time; min++) {
      if (time - min > distance / min) {
        break minloop;
      }
    }
    // because speed scales linear
    let max = time - min;
    return max - min + 1;
  };

  let amount = 1;
  for (const tuple of data) {
    amount *= checkRace(tuple);
  }
  console.log("task1", amount);
};
const solveTask2 = (data) => {
  const correctInput = (data) => {
    const input = [``, ``];
    for (let tuple of data) {
      input[0] = `${input[0]}${tuple[0]}`;
      input[1] = `${input[1]}${tuple[1]}`;
    }
    return input.map((_) => parseInt(_));
  };
  const newInput = correctInput(data);
  solveTask1([newInput]);
};

(async () => {
  const data = await getData();
  solveTask1(data);
  solveTask2(data);
})();
