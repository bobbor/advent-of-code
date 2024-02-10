const { readFile } = require('node:fs/promises');
const { join } = require('node:path');

const defaults = {
  removeEmptyLines: true,
  test: false
}
module.exports.read = async (dir, opts = {}) => {
  const options = Object.assign(defaults, opts);
  const { removeEmptyLines, test} = options;
  
  let fn = 'input.txt';
  if(test) {
    fn = `test${test}.txt`
  }

  try {
    let content = await readFile(join(dir, 'data', fn), {encoding: 'utf8'});
    if(removeEmptyLines) {
      content = content.split('\n').filter(_ => _).join('\n');
    }
    return content;
  } catch(e) {
    console.log(e);
    return ''
  }
}