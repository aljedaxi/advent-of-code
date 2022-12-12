import {readLines} from "https://deno.land/std@0.154.0/io/buffer.ts";
import {StringReader} from "https://deno.land/std/io/mod.ts";
import {load} from 'https://deno.land/x/js_yaml_port/js-yaml.js'

const testData = new StringReader(`Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1`)

const log = k => s => (console.log(k, s), s)
const trace = s => (console.log(s), s)

const collect = async function*(stream) {
  let s = ''
  let test = ''
	for await(const l of readLines(stream)) {
    if (l.length === 0) {
      yield {s, test}
      s = ''
    }
    if (/test/i.test(l)) {
      const [testLiteral, testS] = l.split(': ')
      test = testS
      s += `${testLiteral}:\n`.slice(2).toLowerCase()
      continue
    }
    if (/^Monkey \d+:/.test(l)) {
      continue
    }
    s += l.slice(2).toLowerCase()
    s += '\n'
	}
  yield {s, test}
}

const pf = n => {
  const factors = []
  while (n % 2n == 0) {
    factors.push(2n)
    n /= 2n
  }
  for (let i = 3n; (i * i) <= n; i += 2n) {
    while (n % i == 0) {
      n /= i
      factors.push(i)
    }
  }
  if (n > 2n) {
    factors.push(n)
  }
  return factors
}

const operations = {
  '*': (x, y) => x * y,
  '+': (x, y) => x + y,
}
const createOperation = ([_new, _equals, operand1, opName, operand2]) => {
  const parsed1 = operand1 === 'old' ? undefined : BigInt(operand1)
  const parsed2 = operand2 === 'old' ? undefined : BigInt(operand2) 
  return old => {
    const o1 = operand1 === 'old' ? old : parsed1
    const o2 = operand2 === 'old' ? old : parsed2
    return operations[opName](o1, o2)
}
}
const testify = ([_div, _by, by]) => {
  const b = BigInt(by)
  const factors = pf(b)
  return {b, factors, testF: n => (n % b) === 0n}
}

const parser = async stream => {
  const monkeys = []
  for await (const {test, s} of collect(stream)) {
    const o = load(s)
    const {test: {'if true': ifTrue, 'if false': ifFalse}, operation, 'starting items': startingItems} = o
    const {testF, b, factors} = testify(test.split(' '))
    monkeys.push({
      items: typeof startingItems === 'string'
        ? startingItems.split(', ').map(x => BigInt(x))
        : [BigInt(startingItems)],
      operation: createOperation(operation.split(' ')),
      test: testF,
      factors,
      testN: b,
      ifTrue: parseInt(ifTrue.split(' ').at(-1)),
      ifFalse: parseInt(ifFalse.split(' ').at(-1)),
    })
  }
  return monkeys
}

const inspection1 = ({operation, n, test, ifTrue, ifFalse}) => {
  const duringInspection = operation(n)
  const afterInspection = duringInspection / 3n
  const testRes = test(afterInspection)
  const to = testRes ? ifTrue : ifFalse
  console.log({n, testRes, afterInspection})
  return {
    to: to,
    afterInspection
  }
}


const inspection2 = ({operation, n, test, ifTrue, ifFalse, testN, factors}) => {
  const duringInspection = operation(n)
  const afterInspection = duringInspection
  const testRes = test(afterInspection)
  return {
    to: testRes ? ifTrue : ifFalse,
    afterInspection
  }
}

const round = (monkeys, monkeyInspection) => {
  const inspections = monkeys.map((m, mIdx) => {
    const {items, operation, test, ifTrue, ifFalse} = m
    const myInspections = items.length
    items.forEach((n, nIdx) => {
      const {to, afterInspection} = monkeyInspection({n, ...m})
      monkeys[to].items.push(afterInspection)
    })
    m.items = []
    return myInspections
  })
  return inspections
}

const main = async (stream, rounds, inspection) => {
	const monkeys = await parser(stream)
  let inspections = monkeys.map(m => 0)
  for (let i = 1; i <= rounds; i++) {
    const thisRound = round(monkeys, inspection)
    thisRound.forEach((n, idx) => {
      inspections[idx] += n
    })
    if (new Set([1, 20, 1e3, 2e3]).has(i)) {console.log(i, inspections)}
  }
  const highestTwo = inspections.sort((n, m) => n > m ? -1 : 1).slice(0, 2)
  return highestTwo.reduce((acc, v) => acc * v, 1)
}

const main1 = stream => main(stream, 20, inspection1)
const main2 = stream => main(stream, 10000, inspection2)

const endingVal = await main2(testData)
console.log(endingVal)
