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
	fromMaybe,
	prop,
	filter,
} = S

const trace = s => {console.log(s); return s;};

const n = 9
const input = (await fs.readFile(`./input.${n}.txt`, 'utf8')).trim()

const testData = `2199943210
3987894921
9856789892
8767896789
9899965678`

const cartesize = all => {
	const o = {}
	let x = 0
	let y = 0
	for (let i = 0; i < all.length; i++) {
		const c = all[i]
		if (c === '\n') {
			y += 1
			x = 0
			continue
		}
		o[`${x},${y}`] = fromMaybe (0) (parseInt (10) (c))
		x += 1
	}
	return o
}

const adjacents = pipe ([
	map (parseInt (10)),
	justs,
	([x, y]) => [
		`${x + 1},${y}`,
		`${x - 1},${y}`,
		`${x},${y + 1}`,
		`${x},${y - 1}`,
	],
])

const algo1 = s => {
	const grid = cartesize (s)
	return sum (
		Object.entries (grid)
			.filter (
				([k, v]) => {
					const [x, y] = k.split (',')
					const myAdjacents = adjacents ([x, y])
					return myAdjacents.every (ak => (grid[ak] ?? Infinity) > v)
				}
			)
			.map (([k, v]) => v)
			.map (v => v + 1)
	)
}

const findBasin = grid => pipe ([
	chain (adjacents),
	filter (ak => ak && grid[ak] !== 9),
])

const algo2 = s => {
	const grid = cartesize (s)
	const basins = []
	const alreadyInBasin = k => basins.some (b => b[k])

	Object.entries (grid).forEach (([k,v]) => {
		if (alreadyInBasin) return
		if (v === 9) return
		const [x,y] = k.split (',')
		const basin = findBasin ([[k,v]])
	})
}

console.log('algo2 (testData)', algo2 (testData));

