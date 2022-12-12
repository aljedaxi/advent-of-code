import {readLines} from "https://deno.land/std@0.154.0/io/buffer.ts";
import {StringReader} from "https://deno.land/std/io/mod.ts";

const smolTestData = new StringReader(`noop
addx 3
addx -5`)
const largTestData = new StringReader(`addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`)

const log = k => s => (console.log(k, s), s)
const trace = s => (console.log(s), s)

const cycleThrough = async function*(stream) {
	let cycle = 1
	yield {cycle, addedX: 0}
	for await(const l of readLines(stream)) {
		if (/noop/.test(l)) {
			yield {cycle: ++cycle, addedX: 0}
		}
		if (/addx/.test(l)) {
			const [op, addedX] = l.split(/\s+/)
			yield {cycle: ++cycle, addedX: 0}
			yield {cycle: ++cycle, addedX: parseInt(addedX.trim())}
		}
	}
}

const main1 = async stream => {
	let xRegister = 1
	let sumOfSignalStrengths = 0
	for await(const {cycle, addedX} of cycleThrough(stream)) {
		xRegister += addedX
		console.log({cycle, xRegister})
		// if (cycle === 20 || (cycle + 20) % 40 === 0) sumOfSignalStrengths += (xRegister * cycle)
	}
	return sumOfSignalStrengths
}
const withinOne = n => ({of: m => n === m || n === (m - 1) || n === (m + 1)})

const main2 = async stream => {
	let xRegister = 1
	const rows = new Map()
	for await(const {cycle, addedX} of cycleThrough(stream)) {
		xRegister += addedX
		const spriteX = xRegister
		const beam = (cycle - 1) % 40
		const rowN = Math.floor((cycle - 1) / 40)
		const row = rows.get(rowN) ?? []
		row[beam] = withinOne(beam).of(spriteX) ? '#' : '.'
		rows.set(rowN, row)

		// console.log({cycle, xRegister, beam, row})
		// if (cycle === 20 || (cycle + 20) % 40 === 0) sumOfSignalStrengths += (xRegister * cycle)
	}
	return [...rows.keys()].map(n => rows.get(n).join('')).join('\n')
}

const main = await main2(Deno.stdin)
console.log(main)
