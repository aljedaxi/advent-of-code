import {readLines} from "https://deno.land/std@0.154.0/io/buffer.ts";
import {StringReader} from "https://deno.land/std/io/mod.ts";
import {range} from './12.ts'

const testData = new StringReader(`498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`)
const log = k => s => (console.log(k, s), s)
const trace = s => (console.log(s), s)

const pickle = (x, y) => `${x},${y}`
const fillMap = rock => (x, y) => {
	rock[pickle(x, y)] = '#'
}
const parsePickled = s => s.split(',').map(s => parseInt(s, 10))
const findBounds = map => [...Object.keys(map), '500,0'].reduce(
	(acc, val) => {
		const [x, y] = parsePickled(val)
		const {highestX = x, lowestX = x, highestY = y, lowestY = y} = acc
		return {
			highestX: x >= highestX ? x : highestX,
			lowestX:  x <= lowestX  ? x : lowestX,
			highestY: y >= highestY ? y : highestY,
			lowestY:  y <= lowestY  ? y : lowestY,
		}
	}
)

const paintMap = rock => {
	const {highestX, lowestX, highestY, lowestY} = findBounds(rock)
	const xChars = range(lowestX, highestX + 1).map(n => n.toString().split(''))
	range(0, 3).forEach((y, idx) => {
		const row = range(lowestX, highestX + 1).map(x => xChars[x - lowestX][idx]).join('')
		console.log(`  ${row}`)
	})
	range(lowestY, highestY + 1).forEach(y => {
		const row = range(lowestX, highestX + 1).map(x => rock[pickle(x, y)] ?? '.').join('')
		console.log(`${y} ${row}`)
	})
}

const lower = (x, y) => x > y ? y : x
const higher = (x, y) => x > y ? x : y
const paintLine = (rock, [p1, p2]) => {
	const fill = fillMap(rock)
	const vertical = p1[0] !== p2[0]
	const pIdx = vertical ? 0 : 1
	const pIdo = (pIdx + 1) % 1
	for (let x = lower(p1[pIdx], p2[pIdx]); x <= higher(p1[pIdx], p2[pIdx]); x++) {
		vertical ? fill(x, p1[1]) : fill(p1[0], x)
	}
}
const parse = async stream => {
	const rock = {}
	for await(const l of readLines(stream)) {
		const pairs = l.split(' -> ').map(parsePickled)
		let idx = 0
		while (true) {
			const [p1, p2] = pairs.slice(idx, idx + 2)
			if (!p2) break
			paintLine(rock, [p1, p2])
			idx++
		}
	}
	return rock
}
const fallInto = (map, startingX, startingY, breakCondition, otherCondition) => {
	let x = startingX
	let y = startingY
	while(true) {
		if(breakCondition(x, y)) return map
		if(otherCondition ? otherCondition(x, y) : false) continue
		if(!map[pickle(x, y + 1)]) {
			y += 1
			continue
		}
		if(!map[pickle(x - 1, y + 1)]) {
			x -= 1
			y += 1
			continue
		}
		if(!map[pickle(x + 1, y + 1)]) {
			x += 1
			y += 1
			continue
		}
		map[pickle(x, y)] = 'o'
		return map
	}
}
const main1 = async stream => {
	const rock = await parse(stream)
	const {highestY} = findBounds(rock)
	let turn = 0
	let spinning = true
	while (spinning) {
		fallInto(rock, 500, 0, (x, y) => {
			const breakOff = y > highestY
			spinning = !breakOff
			return breakOff
		})
		turn++
	}
	paintMap(rock)
	return turn - 1
}

const main2 = async stream => {
	const rock = await parse(stream)
	const {highestY} = findBounds(rock)
	const floor = highestY + 2
	let turn = 0
	let spinning = true
	while (spinning) {
		fallInto(
			rock,
			500,
			0,
			(x, y) => {
				const breakOff = rock['500,1'] && (x === 500) && (y === 0)
				spinning = !breakOff
				const hitFloor = y === floor
				if (hitFloor) {
					rock[pickle(x, y)] = 'o'
				}
				return breakOff || hitFloor
			}
		)
		paintMap(rock)
		turn++
	}
	return turn - 1
}

console.log(await main2(testData))
