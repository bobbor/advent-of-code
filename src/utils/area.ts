class Position {
  row: number;
  column: number;

  constructor(r: number, c: number) {
    this.row = r;
    this.column = c;
  }
  toString() {
    return `${this.row}:${this.column}`;
  }
}

export class Item<T> {
  position: Position;
  value: T;
  area: Area<T>;

  constructor(row: number, column: number, value: T, area: Area<T>) {
    this.position = new Position(row, column);
    this.value = value;
    this.area = area;
  }
}

export class Area<T> {
  #raw: Record<string, Item<T>>;
  #cols: Record<number, Position[]>;
  #rows: Record<number, Position[]>;

  constructor(raw: T[][] | { width: number; height: number; value: T }) {
    this.#raw = {};
    this.#cols = {};
    this.#rows = {};

    if (Array.isArray(raw)) {
      const height = raw.length;
      const width = height !== 0 ? raw[0].length : 0;
      for (let r = 0; r < height; r++) {
        if (!Array.isArray(this.#rows[r])) {
          this.#rows[r] = [];
        }
        for (let c = 0; c < width; c++) {
          if (!Array.isArray(this.#cols[c])) {
            this.#cols[c] = [];
          }
          const k = new Position(r, c);
          this.#raw[k.toString()] = new Item(r, c, raw[r][c], this);
          this.#rows[r].push(k);
          this.#cols[c].push(k);
        }
      }
    } else {
      const { height, width, value } = raw;
      for (let r = 0; r < height; r++) {
        if (!Array.isArray(this.#rows[r])) {
          this.#rows[r] = [];
        }
        for (let c = 0; c < width; c++) {
          if (!Array.isArray(this.#cols[c])) {
            this.#cols[c] = [];
          }
          const k = new Position(r, c);
          this.#raw[k.toString()] = new Item(r, c, value, this);
          this.#rows[r].push(k);
          this.#cols[c].push(k);
        }
      }
    }
  }
  get width() {
    // is how many columns we have
    return Object.keys(this.#cols).length;
  }
  get height() {
    // is how many rows we have
    return Object.keys(this.#rows).length;
  }
  /**
   * get columns in an interable way
   */
  get columns() {
    return Object.values(this.#cols).map((keys) =>
      keys.map((k) => this.#raw[k.toString()])
    );
  }
  /**
   * get rows in an interable way
   */
  get rows() {
    return Object.values(this.#rows).map((keys) =>
      keys.map((k) => this.#raw[k.toString()])
    );
  }
  getColumn(idx: number) {
    const idxColumn = this.#cols[idx];
    return idxColumn.map((k) => this.#raw[k.toString()]);
  }
  getRow(idx: number) {
    const idxRow = this.#rows[idx];
    return idxRow.map((k) => this.#raw[k.toString()]);
  }
  at(pos: Position) {
    return this.#raw[pos.toString()];
  }
  [Symbol.iterator]() {
    let r = 0,
      c = -1;
    const next = () => {
      c++;
      if (c === this.width) {
        c = 0;
        r++;
      }
      if (r === this.height) {
        const pos = new Position(r - 1, c);
        return {
          done: true,
          value: this.at(pos),
        };
      }
      const pos = new Position(r, c);
      return { done: false, value: this.at(pos) };
    };
    return {
      next: next.bind(this),
      return() {
        return { done: true, value: undefined };
      },
    };
  }
}
