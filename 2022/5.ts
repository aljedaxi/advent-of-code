import {readLines} from "https://deno.land/std@0.154.0/io/buffer.ts";
import {StringReader} from "https://deno.land/std/io/mod.ts";

const testData = new StringReader(`    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`)

const intoMeows = s => {
	if (!s) return []
	const first4 = s.slice(0, 4)
	return [first4.slice(1, 2), ...intoMeows(s.slice(4))]
}

const parseStackstring = s => {
	const stacks = []
	s.split('\n').slice(0, -1).forEach(l => {
		intoMeows(l).forEach((c, idx) => {
			if (/^\s+$/.test(c)) return
			if (!Array.isArray(stacks[idx + 1])) stacks[idx + 1] = []
			stacks[idx + 1].unshift(c)
		})
	})
	return stacks
}

const parseLine = s => {
	const [n, from, to] = s.match(/move (\d+) from (\d+) to (\d+)/).slice(1)
	return {n, from, to}
}


const parser = async function*(stream) {
	const stackStrings = []
	let stacking = true
	for await(const l of readLines(stream)) {
		if (!stacking) yield parseLine(l)
		if (stacking && l.length) stackStrings.push(l)
		if (!l.length) {
			stacking = false
			yield parseStackstring(stackStrings.join('\n'))
		}
	}
}

const main1 = async stream => {
	let sum = 0
	const generator = parser(stream)
	const state = (await generator.next()).value
	for await(const {n, from, to} of generator) {
		for (let i = 0; i < n; i++) {
			const c = state[from].pop()
			state[to].push(c)
		}
	}
	return state.slice(1).map(xs => xs.at(-1)).join('')
}

const main2 = async stream => {
	let sum = 0
	const generator = parser(stream)
	const state = (await generator.next()).value
	for await(const {n, from, to} of generator) {
		const c = state[from].slice(n * -1)
		state[from] = state[from].slice(0, n * -1)
		state[to] = [...state[to], ...c]
	}
	return state.slice(1).map(xs => xs.at(-1)).join('')
}

const main = await main2(Deno.stdin)
console.log(main)
