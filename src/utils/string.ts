export const rotate = (str: string): string => {
  const arr = str.split("\n").map((line) => line.split(""));
  const max = arr.length;
  const out = Array.from({ length: max }).map((_) => ``);
  for (const row of arr) {
    for (let i = 0; i < row.length; i++) {
      out[i] = `${row[i]}${out[i] ?? ""}`;
    }
  }
  return out.join("\n");
};
