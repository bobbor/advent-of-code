const { read } = require("../utils/file");

const wrongAnswers = {
  q1: [],
  q2: [248806028],
};

const jokerRule = true;
const jokerRank = [
  "J",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "T",
  "Q",
  "K",
  "A",
];
const normalRank = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "T",
  "J",
  "Q",
  "K",
  "A",
];

const rank = jokerRule ? jokerRank : normalRank;

// the smaller the index value of a matching type, the more powerful it is.
const types = [
  (v) => {
    // five of a kind
    return {
      check: v.length === 1 && v[0] === 5,
      name: "five of a kind",
    };
  },
  (v) => {
    // four of a kind
    return {
      check: v.some((n) => n === 4) && v.length === 2,
      name: "four of a kind",
    };
  },
  (v) => {
    // full house
    return {
      check: v.some((n) => n === 3) && v.some((n) => n === 2) && v.length === 2,
      name: "full house",
    };
  },
  (v) => {
    // three of a kind
    return {
      check: v.some((n) => n === 3) && v.length === 3,
      name: "three of a kind",
    };
  },
  (v) => {
    // two pair
    return {
      check: v.length === 3 && v.every((n) => n !== 3),
      name: "two pairs",
    };
  },
  (v) => {
    // one pair
    return { check: v.length === 4, name: "one pair" };
  },
  (v) => {
    // high card
    return { check: v.length === 5, name: "high card" };
  },
];
const theNoHand = { type: types.length, name: "impossible" };

const getType = (handStr) => {
  const hand = handStr.split("").reduce((acc, char) => {
    if (!acc[char]) {
      acc[char] = 0;
    }
    acc[char] += 1;
    return acc;
  }, {});

  const getTypeForHand = (hand) => {
    for (let i = 0; i < types.length; i++) {
      const { check, name } = types[i](Object.values(hand));
      if (check) {
        return { type: i, name };
      }
    }
    return theNoHand;
  };

  if (jokerRule && "J" in hand) {
    let handCopy = { ...hand };
    const jokers = handCopy["J"];
    delete handCopy["J"];
    const _keys = Object.keys(handCopy);
    // this is a joker only hand, type: 0, name: five of a kind.
    // no need to look for other cards as there are none.
    if (!_keys.length) {
      return getTypeForHand(hand);
    }
    /*
     * set the jokers to be of the kind of every other card in hand,
     * and check which type this results in.
     *
     * example:
     * hand: KTJJT => jokers: 2, remaining cards: 1K(ing) & 2T(en)
     * "joker adjusted" hands: KTKKT & KTTTT
     * (setting the joker to anything else would make the hand weaker - KTQQT: type 4, name: 2 pairs)
     * type of hands:
     *   1. KTKKT: type - 3, name: three of a kind
     *   2. KTTTT: type - 1, name: four of a kind
     *
     * result: "best" type of KTJJT is 1, four of a kind.
     */
    return Object.keys(handCopy).reduce(
      (acc, key) => {
        const newHand = { ...handCopy, [key]: handCopy[key] + jokers };
        const type = getTypeForHand(newHand);
        // if the new type is more powerful, choose it.
        return type.type < acc.type ? type : acc;
      },
      // we start with the "impossible hand"
      // aka "weaker than high card", which (hence the name) is not possible
      theNoHand
    );
  }

  // the hand has no jokers, or the joker rule is not enabled
  return getTypeForHand(hand);
};

const parseFile = (data) => {
  return data.map((line) => {
    const [hand, bet] = line.split(" ");
    return { hand, bet: parseInt(bet), ...getType(hand) };
  });
};

const readFile = async (opts) => {
  const content = await read(__dirname, opts);
  return parseFile(content.split("\n"));
};

const reportResult = (question, result) => {
  const wrong = wrongAnswers[question];
  console.log(
    `the result is ${result}${
      wrong.includes(result) ? " (but it's wrong)" : ""
    }`
  );
};

(async () => {
  const hands = await readFile();
  const sortedHands = [...hands].sort((a, b) => {
    const typeOrder = a.type - b.type;
    if (typeOrder) {
      return typeOrder;
    }
    for (let i = 0; i < 5; i++) {
      const rankOrder = rank.indexOf(b.hand[i]) - rank.indexOf(a.hand[i]);
      if (rankOrder) {
        return rankOrder;
      }
    }
  });

  let result = 0;
  const calcStr = [];
  for (let i = 0; i < sortedHands.length; i++) {
    const mult = sortedHands.length - i;
    calcStr.push(`${mult} * ${sortedHands[i].bet}`);
    result += mult * sortedHands[i].bet;
  }
  reportResult(jokerRule ? "q2" : "q1", result);
})();
