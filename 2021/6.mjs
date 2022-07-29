'use strict'
import S from './util.mjs'
import fs from 'fs/promises'
const {
	pipe,
	Left,
	Right,
	justs,
	range,
	sum,
	K,
	ifElse,
	Maybe,
	chain,
	sequence,
	reject,
	parseInt,
	find,
	isJust,
	Nothing,
	any,
	trim,
	map,
	splitOn,
	reduce,
	mult,
	lift2,
	unchecked,
	joinWith,
	splitOnRegex,
	prop,
	filter,
} = S

const trace = s => {console.log(s); return s;};

const n = 6
const input = (await fs.readFile(`./input.${n}.txt`, 'utf8')).trim()

const testData = `3,4,3,1,2`

const makeNewSet = o => {
	const news = Object.fromEntries (
		Object.entries (o).map (
			([k, v]) => [k - 1, v]
		)
	)
	news[6] = (news[-1] ?? 0) + (news[6] ?? 0)
	news[8] = (news[-1] ?? 0)
	delete news['-1']
	return news
}

const runForNDays = ({n, xs}) => {
	const grouped = reduce (acc => val => ({...acc, [val]: (acc[val] ?? 0) + 1})) ({}) (xs)
	let i = n
	let acc = grouped
	while (true) {
		if (i === 0) return sum (Object.values (acc))
		i = i - 1
		acc = makeNewSet (acc)
	}
}

const runFor80Days = xs => runForNDays ({n: 256, xs})

const algo1 = pipe ([
	splitOn (','),
	runFor80Days,
])

console.log('algo1 (input)', algo1 (input));
