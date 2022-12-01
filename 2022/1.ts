import {readLines} from "https://deno.land/std@0.154.0/io/buffer.ts";

const sum = (xs: number[]): number => xs.reduce((x, y) => x + y, 0)
const highest = (xs: number[]): number => xs.reduce((x, y) => x > y ? x : y, -Infinity)
const highestThree = ([first,second,third,...rest]: number[]) => rest.reduce((acc, val) => {
	const found = acc.find(e => e < val)
	if (found) {
		acc[0] = val
		acc.sort((x,y) => x > y ? 1 : -1)
	}
	return acc
}, [first, second, third])

const collectCals = async (stream) => {
	const totalCalories = []
	let elfCalories = []
	for await (const l of readLines (stream)) {
		if (parseInt(l)) {
			elfCalories.push(parseInt(l))
			continue
		}
		totalCalories.push(sum(elfCalories))
		elfCalories = []
	}
	totalCalories.push(sum(elfCalories))
	return totalCalories
}

export const mainOne = async (stream): number => highest(await collectCals(stream))

export const mainTwo = async (stream): number => sum(highestThree(await collectCals(stream)))

console.log(await mainTwo(Deno.stdin))
