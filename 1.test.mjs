import S from './util.mjs'
const {reduce, parseInt, justs, map, pipe, clamp, range, prop} = S

const input = await fs.readFile('./input.1.txt', 'utf8')
const ints = justs (map (parseInt (10)) (input.split('\n')))

const algo1 = pipe ([
	reduce (({last, largers}) => val => ({
		last: val,
		largers: (last && (val > last)) ? largers + 1 : largers,
	})) ({largers: 0}),
	prop ('largers'),
])

const uniq = xs => [...new Set (xs)]
const three = [2, 1, 0]
const algo2 = pipe ([
	reduce (({accs, accIdx}) => val => {
		const idxs = uniq (
			map (idx => clamp (0) (Infinity) (accIdx - idx)) (three)
		)
		return {
			accIdx: accIdx + 1,
			accs: [
				...accs.map ((v, i) => idxs.includes (i) ? v + val : v),
				val,
			],
		}
	}) ({accs: [], accIdx: 0}),
	prop ('accs'),
	xs => xs.slice (0, -2),
	algo1,
])
