import { readFile } from "fs/promises";
import { join } from "path";

export interface ReadFileOptions {
  removeEmptyLines: boolean;
  test?: number;
}

const defaults: ReadFileOptions = {
  removeEmptyLines: true,
};

export const read = async (
  dir: string,
  opts?: Partial<ReadFileOptions>
): Promise<string> => {
  const options = Object.assign(defaults, opts ?? {});
  const { removeEmptyLines, test } = options;

  let filename = "input.txt";
  if (test) {
    filename = `test${test}.txt`;
  }

  try {
    let content = await readFile(join(dir, "data", filename), {
      encoding: "utf8",
    });
    if (removeEmptyLines) {
      content = content
        .split("\n")
        .filter((_) => _)
        .join("\n");
    }
    return content;
  } catch (e) {
    console.log(e);
    return "";
  }
};
