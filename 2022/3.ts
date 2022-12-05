import {readLines} from "https://deno.land/std@0.154.0/io/buffer.ts";
import {StringReader} from "https://deno.land/std/io/mod.ts";

const testData = new StringReader(`vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`)

const c2priority = c => {
	const ifLower = c.charCodeAt(0) - 96
	return ifLower > 0 ? ifLower : ifLower + (97 - 65) + 26
}
const splitDownMiddle = s => {
	const {length} = s
	const c1 = s.slice(0, length / 2)
	const c2 = s.slice(length / 2)
	return [c1, c2]
}
const main1 = async stream => {
	let sum = 0
	for await(const l of readLines(stream)) {
		const [c1, c2] = splitDownMiddle(l).map(s => new Set(s))
		const intersection = [...c1].find(x => c2.has(x))
		sum += c2priority(intersection)
	}
	return sum
}

const group3 = async function*(stream) {
	let group = []
	for await (const l of readLines(stream)) {
		group.push(l)
		if (group.length === 3) {
			yield group
			group = []
		}
	}
}

const main2 = async stream => {
	let sum = 0
	for await(const lines of group3(stream)) {
		const sets = lines.map(s => new Set(s))
		const intersection = sets.reduce(
			(inter, set) => new Set([...set].filter(x => inter.has(x)))
		)
		sum += c2priority(intersection.values().next().value)
	}
	return sum
}

const main = await main2(Deno.stdin)
console.log(main)
