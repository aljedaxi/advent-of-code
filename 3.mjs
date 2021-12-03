import S from './util.mjs'
const {
	pipe,
	map,
	splitOn,
	reduce,
	mult,
	lift2,
	parseInt,
	joinWith,
} = S

const trace = s => {console.log(s); return s;};

const n = 3
const input = (await fs.readFile(`./input.${n}.txt`, 'utf8')).trim()

const processData = pipe ([
	splitOn ('\n'),
	xs => xs.reduce ((acc, val) => val.split('').map ((x, i) => [...acc[i] ?? [], x])),
])

const testData = `00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`

const sumObj = pipe ([Object.values, reduce (mult) (1)])

const getGammaRate = pipe ([
	map (pipe ([
		reduce (acc => val => ({...acc, [val]: (acc[val] ?? 0) + 1})) ({}),
		Object.entries,
		reduce (([ak, av]) => ([vk, vv]) => av > vv ? [ak, av] : [vk, vv]) (['0', -Infinity]),
		([k]) => k,
	])),
	joinWith (''),
	parseInt (2),
])

const getEpsilonRate = pipe ([
	map (pipe ([
		reduce (acc => val => ({...acc, [val]: (acc[val] ?? 0) + 1})) ({}),
		Object.entries,
		reduce (([ak, av]) => ([vk, vv]) => av < vv ? [ak, av] : [vk, vv]) (['0', Infinity]),
		([k]) => k,
	])),
	joinWith (''),
	parseInt (2),
])

const algo1 = pipe ([
	processData,
	d => lift2 (mult) (getGammaRate (d)) (getEpsilonRate (d)),
])

const mostCommonAt = idx => pipe ([
	reduce (acc => val => ({...acc, [val[idx]]: (acc[val[idx]] ?? 0) + 1})) ({}),
	o => o[0] === o[1] ? '1'
	: o[0] > o[1] ? '0'
	: '1',
])

const leastCommonAt = idx => pipe ([
	reduce (acc => val => ({...acc, [val[idx]]: (acc[val[idx]] ?? 0) + 1})) ({}),
	o => o[0] === o[1] ? '0'
	: o[0] < o[1] ? '0'
	: '1',
])

const getOxygenRating = i => xs => {
	if (xs.length === 1) return parseInt (2) (xs[0])
	const common = mostCommonAt (i) (xs)
	return getOxygenRating (i + 1) (xs.filter (x => x[i] === common))
}

const getCO2Rating = i => xs => {
	if (xs.length === 1) return parseInt (2) (xs[0])
	const common = leastCommonAt (i) (xs)
	return getCO2Rating (i + 1) (xs.filter (x => x[i] === common))
}

const algo2 = pipe ([
	splitOn ('\n'),
	xs => lift2 (mult) (getOxygenRating (0) (xs)) (getCO2Rating (0) (xs)),
])

console.log('algo2 (input)', algo2 (input));
