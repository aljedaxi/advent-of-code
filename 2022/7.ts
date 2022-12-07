import {readLines} from "https://deno.land/std@0.154.0/io/buffer.ts";
import {StringReader} from "https://deno.land/std/io/mod.ts";

const testData = new StringReader(`$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`)

const getSizes = async stream => {
	let parents = []
	let pwd
	const sizes = new Map()
	for await(const l of readLines(stream)) {
		const [command, dir] = (l.match(/\$ (\w+)(.*)/) ?? []).slice(1).map(s => s.trim())
		if (command === 'cd') {
			if (dir === '..') {
				pwd = parents.pop()
				continue
			}
			if (pwd) parents.push(pwd)
			pwd = dir 
			continue
		}
		if (command === 'ls') continue
		if (l.includes('dir')) continue
		const [size, fileName] = l.match(/(\d+) (.+)/).slice(1)
		const path = (parents.join('/') + '/' + pwd).slice(1)
		const sum = sizes.get(path) ?? 0
		sizes.set(path, sum + parseInt(size, 10))
		parents.forEach((d, idx) => {
			const myParents = parents.slice(0, idx)
			const path = (myParents.join('/') + '/' + d).slice(1)
			const sum = sizes.get(path) ?? 0
			sizes.set(path, sum + parseInt(size, 10))
		})
	}
	return sizes
}

const main1 = async stream => {
	const sizes = await getSizes(stream)
	return [...sizes.values()].filter(n => n <= 100000).reduce((acc, v) => v + acc, 0)
}

const totalDiskSpace = 70_000_000
const neededSpace = 30_000_000
const main2 = async stream => {
	const sizes = await getSizes(stream)
	const totalUsedSpace = sizes.get('/')
	const totalUnused = totalDiskSpace - totalUsedSpace
	const needed = neededSpace - totalUnused
	const best = [...sizes.values()].filter(v => v > needed).sort((x, y) => x > y ? 1 : -1)[0]
	return best
}

const main = await main2(Deno.stdin)
console.log(main)


