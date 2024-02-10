class Area {
  #raw;
  constructor (raw) {
    if (Array.isArray(raw)) {
      this.#raw = raw;
    } else {
      const { height, width, value } = raw;
      this.#raw = Array.from({ length: height }).map(() =>
        Array.from({ length: width }).map(() => value)
      );
    }
  }
  get width () {
    return this.height ? this.#raw[0].length : 0;
  }
  get height () {
    return this.#raw.length;
  }
  get cols () {
    return Array.from({ length: this.width }).map((_, i) => this.col(i));
  }
  get rows () {
    return Array.from({ length: this.height }).map((_, i) => this.row(i));
  }
  at ([r, c]) {
    return this.#raw[r][c];
  }
  is ([r, c], what) {
    return this.#raw[r][c] === what;
  }

  removeRow (idx) {
    this.#raw = [...this.#raw.slice(0, idx), ...this.#raw.slice(idx + 1)];
  }
  removeCol (idx) {
    for (let r = 0; r < this.height; r++) {
      this.#raw[r] = [...this.#raw[r].slice(0, idx), ...this.#raw[r].slice(idx + 1)];
    }
  }
  addRow (idx, value) {
    this.#raw = [...this.#raw.slice(0, idx), Array.from({ length: this.width }).map(_ => value), ...this.#raw.slice(idx)];
  }
  addCol (idx, value) {
    for (let r = 0; r < this.height; r++) {
      this.#raw[r] = [...this.#raw[r].slice(0, idx), value, ...this.#raw[r].slice(idx)];
    }
  }
  col (idx) {
    if (idx >= this.width) {
      throw new Error("idx is bigger than width");
    }
    return Array.from({ length: this.height }).map((_, row) =>
      this.at([row, idx])
    );
  }
  colStr (idx) {
    return this.col(idx).join("");
  }
  row (idx) {
    if (idx >= this.height) {
      throw new Error("idx is bigger than height");
    }
    return Array.from({ length: this.width }).map((_, col) =>
      this.at([idx, col])
    );
  }
  rowStr (idx) {
    return this.#raw[idx].join("");
  }

  set ([r, c], what) {
    this.#raw[r][c] = what;
  }
  setRow (row, rowStr) {
    rowStr.split("").forEach((item, idx) => {
      this.set([row, idx], item);
    });
  }
  setCol (col, colStr) {
    colStr.split("").forEach((item, idx) => {
      this.set([idx, col], item);
    });
  }

  toString (padded) {
    const name = "AREA:",
      s = "     ";
    const dashes = Array.from({ length: this.width })
      .map((_) => "-")
      .join("");
    const spaces = Array.from({ length: this.width })
      .map((_) => " ")
      .join("");
    let str = `${name} +${padded ? "-" : ""}${dashes}${padded ? "-" : ""}+\n`;
    if (padded) {str += `${s} | ${spaces} |\n`;}
    for (const row of this.rows) {
      str += `${s} |${padded ? " " : ""}${row.join("")}${padded ? " " : ""}|\n`;
    }
    if (padded) {str += `${s} | ${spaces} |\n`;}
    str += `${s} +${padded ? "-" : ""}${dashes}${padded ? "-" : ""}+\n`;
    return str;
  }
  [Symbol.iterator] () {
    let r = 0, c = -1;
    const next = () => {
      c++;
      if (c === this.width) {
        c = 0;
        r++;
      }
      if (r === this.height) {
        return { done: true, value: { pos: [r - 1, c], v: this.at([r - 1, c]) } };
      }
      return { done: false, value: { pos: [r, c], v: this.at([r, c]) } };
    };
    return {
      next: next.bind(this),
      return () {
        return { done: true };
      }
    };
  }
}

module.exports = {
  Area
};
