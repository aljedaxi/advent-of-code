import S from './util.mjs'
const {
	pipe,
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
	joinWith,
	splitOnRegex,
	prop,
	filter,
} = S

const trace = s => {console.log(s); return s;};

const n = 5
const input = (await fs.readFile(`./input.${n}.txt`, 'utf8')).trim()

const testData = `0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`

const absRange = x => y =>
	x > y ? range (y) (x + 1) : range (x) (y + 1)

const isVert = ([[x1], [x2]]) => x1 === x2
const isHor = ([[, y1], [, y2]]) => y1 === y2
const addVertTo = acc => ([[x, y1], [, y2]]) => {
	const range = absRange (y1) (y2)
	range.forEach (y => {
		const xy = `${x},${y}`
		acc[xy] = (acc[xy] ?? 0) + 1
	})
	return acc
}

const addHorTo = acc => ([[x1, y], [x2]]) => {
	const range = absRange (x1) (x2)
	range.forEach (x => {
		const xy = `${x},${y}`
		acc[xy] = (acc[xy] ?? 0) + 1
	})
	return acc
}

const slope = ([[x1, y1], [x2, y2]]) =>
	(y2 - y1) / (x2 - x1)

const slopeIsPositive = pipe ([
	slope,
	x => x > 0,
])

const addDiaTo = acc => points => {
	const [[x1, y1], [x2, y2]] = points
	const mySlope = slope (points)
	const f = x => ((mySlope * (x - x1)) + y1)
	const xRange = absRange (x1) (x2)
	xRange.forEach ((x) => {
		const y = f (x)
		const xy = `${x},${y}`
		acc[xy] = (acc[xy] ?? 0) + 1
	})
	return acc
}

const view = o => {
	const {x: [xMin, xMax], y: [yMin, yMax]} = reduce (acc => val => {
		const [coord, v] = val
		const [x, y] = justs (
			map (parseInt (10)) (coord.split (','))
		)
		const {
			x: [xMin = Infinity, xMax = -Infinity],
			y: [yMin = Infinity, yMax = -Infinity],
		} = acc
		return {
			x: [
				x < xMin ? x : xMin,
				x > xMax ? x : xMax,
			],
			y: [
				y < yMin ? y : yMin,
				y > yMax ? y : yMax,
			]
		}
	}) ({x: [], y: []}) (Object.entries (o))
	const arys = (
		map (y => (
			joinWith ('') (
				map (x => (o[`${x},${y}`] ?? '.').toString ()) (range (xMin) (xMax + 1))
			)
		)) (range (yMin) (yMax + 1))
	)
	return `\n${joinWith ('\n') (arys)}`
}

const countNGreaterThan = n => pipe ([
	Object.values,
	filter (x => x > n),
	xs => xs.length,
])

const algo1 = pipe ([
	splitOn ('\n'),
	reduce (acc => pipe ([
		splitOn (' -> '),
		map (pipe ([
			splitOn (','),
			map (parseInt (10)),
			justs,
		])),
		trace,
		x => isVert (x) ? addVertTo (acc) (x)
		: isHor (x) ? addHorTo (acc) (x)
		: acc,
	])) ({}),
	trace,
	countNGreaterThan (1),
])

const algo2 = pipe ([
	splitOn ('\n'),
	reduce (acc => pipe ([
		splitOn (' -> '),
		map (pipe ([
			splitOn (','),
			map (parseInt (10)),
			justs,
		])),
		trace,
		x => isVert (x) ? addVertTo (acc) (x)
		: isHor (x)     ? addHorTo  (acc) (x)
		:                 addDiaTo  (acc) (x)
	])) ({}),
	countNGreaterThan (1),
])

console.log('algo2 (input)', algo2 (input));
