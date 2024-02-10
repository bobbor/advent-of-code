import { Task, mkSolution } from "utils/answer";
import { arrsum } from "utils/helper";

/*
 * function which holds all right or wrong solutions
 */
const solution = (task: Task) => {
  return mkSolution(task)
    .right({ part: 1, test: 1 }, 95437)
    .right({ part: 2, test: 1 }, 24933642)
    .right({ part: 2 }, 5649896);
  //.wrong({part: 2}, { guess: 107792, diff: "too low" })
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
interface File {
  size: number;
  name: string;
}

interface Directory {
  name: string;
  parent?: Directory;
  dirs: Directory[];
  files: File[];
}
const parseInput = (content: string): Directory => {
  const root: Directory = {
    name: "/",
    dirs: [],
    files: [],
  };
  let cwd = root;
  let inLS = false;

  content.split("\n").forEach((line) => {
    if (line.startsWith("$")) {
      inLS = false;
    }
    if (inLS) {
      const [dirOrSize, name] = line.split(" ");
      if (dirOrSize === "dir") {
        if (!cwd.dirs) {
          cwd.dirs = [];
        }
        const visited = cwd.dirs.some((dir) => dir.name === name);
        if (!visited) {
          cwd.dirs.push({ name, parent: cwd, dirs: [], files: [] });
        }
      } else {
        cwd.files.push({
          size: parseInt(dirOrSize),
          name,
        });
      }
    } else {
      // command
      const fullCmd = line.slice(1).trim();
      const [cmd, ...args] = fullCmd.split(" ");
      switch (cmd) {
        case "cd":
          switch (args[0]) {
            case "/":
              cwd = root;
              break;
            case "..":
              cwd = cwd.parent!;
              break;
            default: {
              cwd = cwd.dirs.find((dir) => dir.name === args[0])!;
              break;
            }
          }
          break;
        case "ls":
          inLS = true;
          break;
      }
    }
  });

  return root;
};

/*
 * read content of input file(s)
 */
const readInput = async (
  task: Task
): Promise<ReturnType<typeof parseInput>> => {
  let files: Record<
    string | `test${number}`,
    () => Promise<{ default: string }>
  > = {
    input: () => import("./input.txt"),
    test1: () => import("./test1.txt"),
  };
  let file = files.input;
  if (task.test) {
    file = files[`test${task.test}`];
  }
  const content = await file();
  return parseInput(content.default);
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/*
 * run part 1 specific logic here
 */
const du = (folder: Directory): number => {
  const ownSize = folder.files.reduce((acc, file) => acc + file.size, 0);
  let subSize = 0;
  if (folder.dirs) {
    subSize = folder.dirs.reduce<number>((acc, dir) => acc + du(dir), 0);
  }
  return ownSize + subSize;
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Part 1                                                    *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
const solvePart1 = (filesystem: ReturnType<typeof parseInput>): number => {
  const limit = 100000;
  const folderSizes: number[] = [];
  const duOnLimit = (folder: Directory) => {
    if (folder.dirs) {
      folder.dirs.forEach(duOnLimit);
    }
    const size = du(folder);
    if (size < limit) {
      folderSizes.push(size);
    }
  };
  duOnLimit(filesystem);
  return arrsum(folderSizes);
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
const solvePart2 = (root: ReturnType<typeof parseInput>): number => {
  const fileSystemSize = 70000000;
  const updateSize = 30000000;
  const rootFolderSize = du(root);
  const freeSpace = fileSystemSize - rootFolderSize;
  const extraRequiredSpace = updateSize - freeSpace;
  let picked: number = rootFolderSize;

  const recurse = (folder: Directory) => {
    const size = du(folder);
    if (size > extraRequiredSpace && size < picked) {
      picked = size;
    }
    folder.dirs.forEach(recurse);
  };

  recurse(root);
  return picked;
};

/*
 * main function
 *
 * You shouldn't need to touch me
 */
const solveDay = async (task: Task) => {
  console.clear();
  const input = await readInput(task);
  const guess = solution(task).build();

  let result: number,
    startTs = performance.now(),
    end: number;
  switch (task.part) {
    case 1:
      result = solvePart1(input);
      end = performance.now() - startTs;
      guess.check(result, end);
      break;
    case 2:
      result = solvePart2(input);
      end = performance.now() - startTs;
      guess.check(result, end);
      break;
  }
};

solveDay({ part: 2, test: 1 });
