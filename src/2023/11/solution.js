const { read } = require("../utils/file");

const readUniverse = async (opts) => {
  const content = await read(__dirname, opts);
  return content.split("\n").map((l) =>
    l
      .split("")
      .map((c) => (c === "." ? 1 : c))
      .filter((_) => _)
  );
};

const mkUniverse = (data) => {
  const NOTHING = 1;
  const GALAXY = "#";

  const u = {
    at([r, c]) {
      return data[r][c];
    },
    get width() {
      return u.height ? data[0].length : 0;
    },
    get height() {
      return data.length;
    },
    isEmptyColumn(idx) {
      for (let i = 0; i < u.height; i++) {
        if (u.at([i, idx]) === GALAXY) {
          return false;
        }
      }
      return true;
    },
    isEmptyRow(idx) {
      for (let i = 0; i < u.width; i++) {
        if (u.at([idx, i]) === GALAXY) {
          return false;
        }
      }
      return true;
    },
    addEmptyRows(idx, amount) {
      for (let i = 0; i < u.width; i++) {
        data[idx][i] += amount;
      }
    },
    addEmptyColumns(idx, amount) {
      for (let i = 0; i < u.height; i++) {
        if (data[i][idx] !== NOTHING + amount) {
          data[i][idx] += amount;
        }
      }
    },
    get galaxies() {
      const result = [];
      for (let i = 0; i < u.height; i++) {
        for (let j = 0; j < u.width; j++) {
          if (u.at([i, j]) === GALAXY) {
            result.push([i, j]);
          }
        }
      }
      return result;
    },
    toString() {
      const alt = false;
      let out = "";
      for (let i = -1; i <= u.height; i++) {
        if (i === -1 || i === u.height) {
          out +=
            "+" +
            Array.from({ length: u.width })
              .map((_) => "─")
              .join("") +
            "+";
        } else {
          out += "│";
          for (let j = 0; j < u.width; j++) {
            if (u.at([i, j]) === GALAXY) {
              out += alt ? "•" : GALAXY;
            } else {
              out += alt ? " " : u.at([i, j]);
            }
          }
          out += "│";
        }
        if (i !== u.height) {
          out += "\n";
        }
      }
      return out;
    },
  };

  return u;
};
const expandUniverse = (universe, by) => {
  let i;
  for (i = universe.height - 1; i >= 0; i--) {
    if (universe.isEmptyRow(i)) {
      universe.addEmptyRows(i, by - 1);
    }
  }
  for (i = universe.width - 1; i >= 0; i--) {
    if (universe.isEmptyColumn(i)) {
      universe.addEmptyColumns(i, by - 1);
    }
  }
};

(async () => {
  const universeData = await readUniverse();
  const universe = mkUniverse(universeData);
  expandUniverse(universe, 1_000_000);
  const galaxies = universe.galaxies;
  let distance = 0;
  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      let x, y, k;
      const posA = galaxies[i];
      const posB = galaxies[j];

      const rmi = Math.min(posA[0], posB[0]);
      const rma = Math.max(posA[0], posB[0]);
      const cmi = Math.min(posA[1], posB[1]);
      const cma = Math.max(posA[1], posB[1]);

      x = 0;
      for (k = rmi; k < rma; k++) {
        if (universe.at([k, cmi]) !== "#") {
          x += universe.at([k, cmi]);
        } else {
          x += 1;
        }
      }
      y = 0;
      for (k = cmi; k < cma; k++) {
        if (universe.at([rmi, k]) !== "#") {
          y += universe.at([rmi, k]);
        } else {
          y += 1;
        }
      }

      distance += x + y;
    }
  }
  console.log("distance", distance);
})();
