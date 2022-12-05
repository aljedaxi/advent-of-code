import {readLines} from "https://deno.land/std@0.154.0/io/buffer.ts";
import { StringReader } from "https://deno.land/std/io/mod.ts";

const translation = {
	A: 'rock',
	B: 'paper',
	C: 'scissors',
	X: 'rock',
	Y: 'paper',
	Z: 'scissors',
}

const rock = {
	rock: 3,
	paper: 6,
	scissors: 0,
}

const paper = {
	rock: 0,
	paper: 3,
	scissors: 6,
}

const scissors = {
	scissors: 3,
	paper: 0,
	rock: 6,
}

const yoursTheirs = {rock, paper, scissors}
const scoreByShape = {rock: 1, paper: 2, scissors: 3}

const testData = new StringReader(`A Y
B X
C Z`)

const main1 = async stream => {
	let score = 0
	for await(const l of readLines(stream)) {
		const [theirs, yours] = l.split(/\s+/).map(k => translation[k])
		score += scoreByShape[yours]
		score += yoursTheirs[theirs][yours]
	}
	return score
}

const main2 = async stream => {
	const rock = {draw: 'rock', lose: 'scissors', win: 'paper'}
	const paper = {draw: 'paper', lose: 'rock', win: 'scissors'}
	const scissors = {draw: 'scissors', lose: 'paper', win: 'rock'}
	const byOutcome = {rock, paper, scissors}
	const translation = {
		A: 'rock',
		B: 'paper',
		C: 'scissors',
		X: 'lose',
		Y: 'draw',
		Z: 'win',
	}
	let score = 0
	for await(const l of readLines(stream)) {
		const [theirs, outcome] = l.split(/\s+/).map(k => translation[k])
		const yours = byOutcome[theirs][outcome]
		score += scoreByShape[yours]
		score += yoursTheirs[theirs][yours]
	}
	return score
}
