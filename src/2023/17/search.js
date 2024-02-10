const dijkstra = (grid, start, goal) => {
  let track = [];
  const setupTrack = () => {
    // setup visited array.
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        track.push({
          pos: [i, j],
          visited: false,
          distance: i === 0 && j === 0 ? 0 : Infinity,
        });
      }
    }
  };

  const getNeighbors = ({ pos }, w = grid.length, h = grid[0].length) =>
    [
      [pos[0] - 1, pos[1]],
      [pos[0], pos[1] - 1],
      [pos[0] + 1, pos[1]],
      [pos[0], pos[1] + 1],
    ]
      .filter(([r, c]) => {
        if (r < 0 || r >= h) {
          return false;
        }
        if (c < 0 || c >= w) {
          return false;
        }
        return !track.find(({ pos: [_r, _c] }) => r === _r && c === _c).visited;
      })
      .map(([r, c]) => track.find(({ pos: [_r, _c] }) => r === _r && c === _c));

  setupTrack();
  let first = {
    pos: start,
    visited: false,
    distance: 0,
  };

  do {
    const neighbors = getNeighbors(first);
    neighbors.forEach(({ pos: [r, c] }) => {
      const idx = track.findIndex(({ pos: [_r, _c] }) => r === _r && c === _c);
      track[idx].distance = grid[r][c];
    });
    const idx = track.findIndex(
      ({ pos: [_r, _c] }) => first.pos[0] === _r && first.pos[1] === _c
    );
    track[idx].visited = true;
    first = track
      .filter(({ visited, distance }) => !visited && distance !== Infinity)
      .sort((a, b) => a.distance - b.distance)
      .at(0);
  } while (first);

  console.log(track);
};

const grid = [
  [2, 4, 1],
  [3, 2, 1],
  [3, 2, 5],
];

dijkstra(grid, [0, 0], [2, 2]);
