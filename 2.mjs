import S from './util.mjs'
const {
	pipe,
	map,
	splitOn,
	reduce,
	mult,
} = S

const trace = s => {console.log(s); return s;};

const n = 2
const input = await fs.readFile(`./input.${n}.txt`, 'utf8')
const processData = pipe ([
	splitOn ('\n'),
	map (pipe ([
		x => x.split(' '),
		([direction, extent]) => ({direction, extent: parseInt (extent)}),
	])),
])

const sumObj = pipe ([Object.values, reduce (mult) (1)])

const algo1 = pipe ([
	processData,
	reduce (({x = 0, y = 0}) => ({direction, extent}) => ({
		x: direction === 'forward' ? x + extent 
		:                            x,
		y: direction === 'down'    ? y + extent
		:  direction === 'up'      ? y - extent
		:                            y
	})) ({}),
	sumObj,
])

const algo2 = pipe ([
	processData,
	reduce (({x, y, aim}) => ({direction, extent}) => ({
		aim: direction === 'down'    ? aim + extent
		:    direction === 'up'      ? aim - extent
		:                              aim,
		x:   direction === 'forward' ? x + extent
		:                              x,
		y:   direction === 'forward' ? y + (extent * aim)
		:                              y,
	})) ({x: 0, y: 0, aim: 0}),
	({x, y}) => ({x, y}),
	sumObj,
])

const testData = `forward 5
down 5
forward 8
up 3
down 8
forward 2`

console.log('algo2 (input)', algo2 (input));
