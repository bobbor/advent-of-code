class Walker {
  position;
  direction;

  static LEFT = "LEFT";
  static RIGHT = "RIGHT";
  static UP = "UP";
  static DOWN = "DOWN";

  constructor(options) {
    if (!options) options = {};
    this.position = options.position ?? [0, 0];
    this.direction = options.direction ?? Walker.RIGHT;
  }
  #move({ distance, direction, position }) {
    const [r, c] = position;
    if (direction === Walker.RIGHT) {
      return [r, c + distance];
    } else if (direction === Walker.LEFT) {
      return [r, c - distance];
    } else if (direction === Walker.UP) {
      return [r - distance, c];
    } else {
      return [r + distance, c];
    }
  }
  #turn({ way, direction }) {
    if (!(way === "left" || way === "right" || way === "around")) {
      throw new Error("you can only turn left, right or around");
    }
    if (way === "left") {
      return direction === Walker.UP
        ? Walker.LEFT
        : direction === Walker.LEFT
        ? Walker.DOWN
        : direction === Walker.DOWN
        ? Walker.RIGHT
        : Walker.UP;
    }
    if (way === "right") {
      return direction === Walker.UP
        ? Walker.RIGHT
        : direction === Walker.RIGHT
        ? Walker.DOWN
        : direction === Walker.DOWN
        ? Walker.LEFT
        : Walker.UP;
    }
    return direction === Walker.UP
      ? Walker.DOWN
      : direction === Walker.DOWN
      ? Walker.UP
      : direction === Walker.LEFT
      ? Walker.RIGHT
      : Walker.LEFT;
  }

  check(dir, fn) {
    if (
      !(
        dir === "left" ||
        dir === "right" ||
        dir === "ahead" ||
        dir === "behind"
      )
    ) {
      throw new Error("that is not a valid direction");
    }
    let direction;
    if (dir === "ahead") {
      direction = this.direction;
    } else if (dir === "behind") {
      direction = this.#turn({ way: "around", direction: this.direction });
    } else if (dir === "left") {
      direction = this.#turn({ way: "left", direction: this.direction });
    } else {
      direction = this.#turn({ way: "right", direction: this.direction });
    }
    let position = this.#move({
      distance: 1,
      direction,
      position: this.position,
    });
    fn({ tile: this.area.at(position) });
  }
  move(distance) {
    this.position = this.#move({
      distance,
      direction: this.direction,
      position: this.position,
    });
    return this.position;
  }
  turn(way) {
    this.direction = this.#turn({
      way,
      direction: this.direction,
    });
    return this.direction;
  }
}

class AreaWalker extends Walker {
  area;

  constructor(area, options) {
    super(options);
    this.area = area;
  }
  moveSave(distance) {
    const [r, c] = this.position;
    if (this.direction === Walker.RIGHT) {
      this.position = [r, Math.min(c + distance, this.area.width - 1)];
    } else if (this.direction === Walker.LEFT) {
      this.position = [r, Math.max(c - distance, 0)];
    } else if (this.direction === Walker.UP) {
      this.position = [Math.max(r - distance, 0), c];
    } else {
      this.position = [Math.min(r + distance, this.area.height - 1), c];
    }
    return this.position;
  }
  outOfBounds() {
    const [r, c] = this.position;
    return r < 0 || c < 0 || r >= this.height || r >= this.width;
  }
}

module.exports = {
  Walker,
  AreaWalker,
};
