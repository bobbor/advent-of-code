const { read } = require('../utils/file');

const readFile = async (opts) => {
  const content = await read(__dirname, opts);
   return content.split('\n');
}

/*
 * API design
 * const converter = almanac.from('seeds').to('location');
 * converter([1,2,3,...])
 */

const memo = (() => {
  const cache = {};
  return (id, fn) => {
    const f = (...args) => {
      const flatArgs = args.map(JSON.stringify).join(',')
      const k = `${id}:${flatArgs}`
      if(k in cache) {
        return cache[k];
      }
      cache[k] = fn(...args);
      return cache[k];
    }
    f.id = id;
    return f;
  }
})()

const asyncLoop = async (fn, condition) => {
  const rets = [];
  let ended = condition();
  return new Promise((ok, fail) => {
    if(ended) {
      return ok(rets);
    }
    let timer = setInterval(() => {
      if(ended) {
        clearInterval(timer);
        return ok(rets);
      }
      rets.push(fn())
      ended = condition()
    }, 16)
  });
}


const mkAlmanac = (map) => {
  let _from, _to;

  const mkConverter = () => {
    const keys = Object.keys(map);
    let found = false;
    let from = _from;
    const order = []
    do {
      const k = keys.find((k) => new RegExp(`^${from}:`).test(k));
      if(!k) {
        throw new Error(`no key starts with ${from}`)
      }
      order.push(memo(k, (num) => {
        for(const [d, s, r] of map[k]) {
          if(num >= s && num < s + r) {
            return d + (num - s);
          }
        }
        return num
      }));
      from = k.split(':')[1];
      found = (from === _to)
    } while(!found);
    return (input) => {
      if(!Array.isArray(input)) {
        input = [input];
      }
      return input.map((num) => {
        const reduced = order.reduce((acc, fn) => {
          return fn(acc);
        }, num)
        return reduced;
      })
    }
  }
  const api = {
    from: (start) => {
      _from = start;
      if(_from && _to) {
        return mkConverter()
      }
      return api;
    },
    to: (end) => {
      _to = end;
      if(_from && _to) {
        return mkConverter()
      }
      return api
    }
  }
  return api;
}
const parseContent = (data) => {
  const [, acc] = data.reduce(([k, acc], mapping) => {
    const naming = /([a-z]+)\-to\-([a-z]+)\ map/.exec(mapping)
    if(naming !== null) {
      k = `${naming[1]}:${naming[2]}`;
      if(!(k in acc)) {
        acc[k] = [];
      }
      return [k, acc];
    } else {
      const inner = acc[k];
      const [d, s, r] = mapping.split(' ').map(_ => parseInt(_));
      acc[k] = [...inner,[d, s, r]];
      return [k, acc];
    }
  }, [undefined, {}])
  return acc;
}

const arrmin = (arr) => {
  return arr.reduce((acc, num) => Math.min(acc, num), Math.min());
}

(async () => {
  const [seedStr, ...statements] = await readFile();
  const map = parseContent(statements);
  const almanac = mkAlmanac(map)
  const converter = almanac.from('seed').to('location');
  const [,seeds] = seedStr.split(':');
  const parsedSeeds = seeds.split(' ').filter(_ => _).map(_ => parseInt(_.trim()))
  const inputTask1 = parsedSeeds
  const memoConverter = memo('converter', converter);
  const outTask1 = inputTask1.map((n) => memoConverter(n));
  console.log(`task1: ${arrmin(outTask1)}`);
  
  let min = Math.min()
  const chunks = 50_000;
  for(let i = 0; i < parsedSeeds.length; i+=2) {
    const [s, r] = [parsedSeeds[i], parsedSeeds[i+1]];
    for(let j = 0; j < r; j += chunks) {
      const now = performance.now()
      if(j !== 0) {
        console.log('\u001b[2A')
      }
      const out = Array.from({ length: Math.min(chunks, r - j) }).map((_,idx) => memoConverter(s+idx))
      min = Math.min(min, arrmin(out))
      console.log(`${min} [${i+1}:${i+2}/${parsedSeeds.length}] ${(100*j/(r-1)).toFixed(2)}% (${Math.round(j/chunks)+1}/${Math.ceil(r/chunks)}) - ${(performance.now() - now).toFixed(0)}ms                 `)
    }
  }
  console.log(`task2: ${min}`)
})()