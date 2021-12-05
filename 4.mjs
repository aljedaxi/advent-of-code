import S from './util.mjs'
const {
	pipe,
	sum,
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

const n = 4
const input = (await fs.readFile(`./input.${n}.txt`, 'utf8')).trim()

const testData = `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7
`

const makeBoard = pipe ([
	splitOn ('\n'),
	map (splitOnRegex (/\s+/g)),
	map (filter (Boolean)),
	xs => xs.flatMap ((row, rowIdx) => row.map ((n, colIdx) => [n, {row: rowIdx, col: colIdx, drawn: false}])),
	Object.fromEntries,
])

const mark = n => map (
	board => {
		const boardAtN = board[n]
		return boardAtN
			? {...board, [n]: {...boardAtN, drawn: true}}
			: board
	}
)

const hasWon = pipe ([
	Object.values,
	reduce (acc => ({drawn, row, col}) => ({
		...acc,
		[`r${row}`]: (acc[`r${row}`] ?? true) && drawn,
		[`c${col}`]: (acc[`c${col}`] ?? true) && drawn,
	})) ({}),
	Object.values,
	any (Boolean),
])

const calcScore = number => pipe ([
	filter (({drawn}) => !drawn),
	Object.keys,
	map (parseInt (10)),
	sequence (Maybe),
	map (sum),
	lift2 (mult) (parseInt (10) (number)),
])

const keepOnChecking = numbers => boards => {
	const [thisNumber, ...nextRoundNumbers] = numbers
	if (!thisNumber) return Nothing
	const markedBoards = mark (thisNumber) (boards)
	const winningBoard = find (hasWon) (markedBoards)
	if (isJust (winningBoard)) return chain (calcScore (thisNumber)) (winningBoard)
	return keepOnChecking (nextRoundNumbers) (markedBoards)
}

const checkUntilOneLeft = numbers => boards => {
	const [thisNumber, ...nextRoundNumbers] = numbers
	if (!thisNumber) return Nothing
	const markedBoards = mark (thisNumber) (boards)
	const losingBoards = reject (hasWon) (markedBoards)
	if (losingBoards.length === 0 && markedBoards.length === 1) {
		return calcScore (thisNumber) (markedBoards[0])
	}
	return checkUntilOneLeft (nextRoundNumbers) (losingBoards)
}

const formatData = pipe ([
	trim,
	splitOn ('\n\n'),
	([numbers, ...boards]) => ({
		numbers: splitOn (',') (numbers),
		boards: map (makeBoard) (boards),
	}),
])

const algo1 = pipe ([
	formatData,
	({numbers, boards}) => keepOnChecking (numbers) (boards),
])

const algo2 = pipe ([
	formatData,
	({numbers, boards}) => checkUntilOneLeft (numbers) (boards),
])

console.log('algo2 (input)', algo2 (input));
