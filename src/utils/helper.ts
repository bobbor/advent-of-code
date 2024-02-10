interface HumanTimeOptions {
  ms: boolean;
  s: boolean;
  m: boolean;
  h: boolean;
  padded: boolean;
}

export const humanTime = (
  ts: ReturnType<typeof performance.now>,
  opts: Partial<HumanTimeOptions>
): string => {
  const { ms, s, m, h, padded }: HumanTimeOptions = Object.assign(
    { ms: false, s: true, m: true, h: false, padded: true },
    opts
  );
  const v = Math.round(ts);
  const milliseconds = v % 1000;
  const sv = (v - milliseconds) / 1000;
  const seconds = sv % 60;
  const mv = (sv - seconds) / 60;
  const minutes = mv % 60;
  const hv = (mv - minutes) / 60;
  const hours = hv;

  return [
    ...(hours && h ? [`${padded ? pad(hours, 2) : hours}h`] : []),
    ...(minutes && m ? [`${padded ? pad(minutes, 2) : minutes}m`] : []),
    ...(seconds && s
      ? [`${padded ? pad(seconds, 2) : seconds}${!ms ? "s" : ""}`]
      : []),
    ...(ms ? [`.${pad(milliseconds, 3)}s`] : []),
  ].join("");
};

export const pad = (n: number, l: number, char: string = "0"): string => {
  const offset = Math.pow(10, l - 1);
  if (n < offset) {
    if (n === 0 && offset === 1) {
      return `${n}`;
    }
    return `${char}${pad(n, l - 1, char)}`;
  }
  return `${n}`;
};

export const arrmin = (arr: number[]) => {
  return arr.reduce((acc, num) => Math.min(acc, num), Math.min());
};
export const arrmax = (arr: number[]) => {
  return arr.reduce((acc, num) => Math.max(acc, num), Math.max());
};

export const arrsum = (arr: number[]) => {
  return arr.reduce((acc, num) => acc + num, 0);
};
