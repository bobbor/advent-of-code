#!/usr/bin/env bash
YEAR=${2}
DAY=${3}
FOLDER="src/${YEAR}/${DAY}"
ACTION=${1}

function createDay() {
  if [[ -d "./${FOLDER}" ]]; then
    echo "day ${FOLDER} already created. stopping."
    return;
  fi;
  mkdir -p "${FOLDER}"
  mkdir -p "${FOLDER}/data"
  touch "${FOLDER}/data/test1.txt"
  touch "${FOLDER}/data/input.txt"

  cat << EOF > "${FOLDER}/solution.js"
const { read } = require("../utils/file");
const { mkSolution } = require("../utils/answer");

/*
 * function which holds all right or wrong solutions
 */
 const solution = () => {
  return mkSolution()
    //.right(1, 52, { test: 2 })
    //.right(2, 145, { test: 1 })
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
  return content;
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

// ...
// ...
// ...

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Part 1                                                    *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
const solvePart1 = (input) => {
  // go do it, while it's easy
  return 0;
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/*
 * run part 2 specific logic here
 */

// ...
// ...
// ...

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Part 2                                                    *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
const solvePart2 = (input) => {
  // good luck
  return 0;
};

/*
 * main function
 * 
 * You shouldn't need to touch me
 */
const solveDay${NUMBER} = async (task, test) => {
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

solveDay${NUMBER}(1, { test: 1 });
EOF
}

function runDay() {
  if [[ ! -d "./${FOLDER}" ]]; then
    echo "day ${FOLDER} does not exist"
    return;
  else
    node "./${FOLDER}/solution.js"
  fi
}

function watchDay() {
  if [[ ! -d "./${FOLDER}" ]]; then
    echo "day ${FOLDER} does not exist"
    return;
  else
    chokidar "./${FOLDER}/solution.js" "./${FOLDER}/data/*.txt" "./utils/*" -c "clear && node ./${FOLDER}/solution.js" --initial
  fi
}

function help() {
    echo "wrong invocation"
    echo "./day.sh {create|run|watch} YEAR NUMBER (as in 1-25)"
}

if [ "x${DAY}" = "x" ] || [ "x${YEAR}" = "x" ]; then
  help;
  exit 1;
fi
case ${ACTION} in
  create)
    createDay
    watchDay
    ;;
  run)
    runDay
    ;;
  watch)
    watchDay
    ;;
  *)
    help;
    exit 1
esac