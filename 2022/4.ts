import {readLines} from "https://deno.land/std@0.154.0/io/buffer.ts";
import {StringReader} from "https://deno.land/std/io/mod.ts";

const testData = new StringReader(`2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`)

const main1 = async stream => {
	let sum = 0
	for await(const l of readLines(stream)) {
		const [p1, p2] = l.split(',')
			.map(s => s.split('-').map(s => parseInt(s)))
		const contains = (p1[0] <= p2[0] && p1[1] >= p2[1])
			            || (p2[0] <= p1[0] && p2[1] >= p1[1])
		sum += contains ? 1 : 0
	}
	return sum
}

const main2 = async stream => {
	let sum = 0
	for await(const l of readLines(stream)) {
		const [p1, p2] = l.split(',')
			.map(s => s.split('-').map(s => parseInt(s)))
		const overlap = (p1[0] <= p2[0] && p2[0] <= p1[1])
			           || (p2[0] <= p1[0] && p1[0] <= p2[1])
		sum += overlap ? 1 : 0
	}
	return sum
}

const main = await main2(Deno.stdin)
console.log(main)
