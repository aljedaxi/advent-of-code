import {readLines} from "https://deno.land/std@0.154.0/io/buffer.ts";
import {StringReader} from "https://deno.land/std/io/mod.ts";

const testData = 'mjqjpqmgbljsphdztnvjfqwrcgsmlb'
const input = 'rgffbnnqvqhhmtmzzmmpmllcggsdswwvvwzzpptbppgngsnncwcnwcwnwgwrwrrnqnlqlccwggrcgrccjgcgwghgffjgjgrgmmsrrhchfcfdccjwwzdzcdcbcjjtfjjltlvvtstvttszsvsmmfccwcjwwzmzhhjvjpvjpppcwppdtdvtdvtvztzvzffdfqqgbgffrgrpgphhbcctssncsnncfcppvnpvnvfnfvnnfggtpplggwsggldllzvzrznncbbjpplbbrrnsrssmrsrhhmqmnqqhpqqnrqnrrtrnnrwrwhhpjhphlhvvgbgzztqtvvmssdshhqnhnjjvhjhqqbrqrrmrlrdllvrlvlccfvcffhfssgvsswhwqqfwfwhhcffjmmjrrbgrgjgrrvsrvvwmwsmmszzvmzvmmwmtthvvfbfllpjpwpwjpwpnpjpqqwtqtwwqpwqqrsqqcpqqssrgsrrjwwqmwmgwgrggmvmgmfgmffjfhjfjttcztccmtmmccnznhhcgcffmnfmmqjjhwwtccbzbhhwnhnsnmsnmnqqchhhnggbzbjzjzszsfsjfjvffnlffvrvddbhhqccdnnzwnznjnpnmppthhqddjhddqjqlqplqqjpjwppqttswsvwvfwflfplffnbfbwfwhhlhtlhtltzzmlmslmlwwgzwzrrwhhlnnrfnnmpppjpgpbbhpbhppbrppbhhzgzczqcqvqggwppcnnhnznvznzhhcpctptpjtppdhhprhrcrpcprpplrprzrnrfnrnlrlvrrfqqnnsqsqrssnrnvvvghvvbzzqppjsjnnrprwrrmqqtfqfwwrdrsddprddbdzbdbndbdjdljjrtjrrnzrzjrzzpssftfmfbflbbcpcsppwrppntnhthlthtbbsmsbmsmggpssnhnjjtsjjwssdjdwwppcbpcclmccwzzrggmgmnnwjnnqppjttvllmhhvcctptbpbdpdhdqqgggbnnqcchlhssltstllvqlvqvdvjdvvqvsvfvhfhlfftqffztzdttfvvzmvzznvnsnjjvqjvjljplpvvzlzhzghgddbbzbmbnztgthrnpsqhhdvprtpdftmqfvgjzgdvqwmvgwbczvbschqfhdvqcfnmbgmtqmlmsqcbfhshrzzbrtpgnwwtzgnjghzrlwhntprqhvshjcfvlnchccbtnswfnmpccdppqrqrhngvlwrpplbnpgzbzwtzwrsptmsmlndcfmbnqgvnqvzwpvrtfsrwfvfwdvplrfdddwcnwhzchmwfjsfvbtbrjchmgqwfvvmpzhqcbzhrcmjrzmgrtnzrcqdqdqnpwjctlhrjcphbbcvhvqnhtwjrvrbzfzfzzplshvrcchvtgtjcnhlzsttwdhcmdvrdlgsngvtzqsjrcptwwbgvfbsvgnmfhmvgqtfzbhhmdznjlsghhnlwzhvplfvlqzbrsjhdvrshjbnfqgpscbpzmnmmcsdbtwbwmsvfjwdvtctslcqfssrhczdptlrjbfzjctqrcbppcfcbqqzhhftdjchtscwgwcnpvrrjvnnwrqtrqmbgdfcpqhddnvdnmlmqcgsndwbcfvfrzsrflsnqrpmszqrdlshlcsfrmnsqmtrvjwqcllftscwrtmvcjsmrlqvdfjzgfdtswqzldqgjvhczpqrfbclnbwcjprjncvhgfmjhgfgnvfzfnvbbstgsgtspdhtfsncttlwmllbbvqftjtshfjlqtjwlvrbwmzfhdmcbhtqdzqtzmdljqprwhqwcvbtfqbpjwztgqrvlrqdwmqrqzvptsgjdqnqdfwfpjdglwgpdrcfrrzmpjmtbwwrqqcsnmphcqtthlnlzlfftrjmtjwwqrldcfjjclzrsqvltsfchfggcwbzbtpqcjfvgpwnwwqrdbdvjplgsgctdhqvttmtpmmjfcqdslhjgtdppbmzbrfbrrjncfdhlmjgdwjrmbgpcgctghbvphpgfvvfvtplqrhnjjhqntjvbsggvrvjgrwptcgqgrmjtprvhnvjsdsfqrqrrltlhvfsjsqpbwndbsnjzplcfqtfbdqdzdvnljcsmjnrmwwjzqwsjbdlclsmccbqwnlpltqhqhmthhrdjwlqwrbltghsvblqntvjqzpmmpqwrrwvhmtfqzhrmjfglwfpthhgbhdmrtprtqgqbdcfqlbbvmzmchzglmpzdvhpqchhclbcvrcmhtzqfzrplbvmdhghsttzgdjbgmmtvlqjsstgwlwchhwmflwbgljgszghvfdsngbtbcnhzmmdmsjqfbcsmgpjwjqgwqdlrgznnmhphbrzcgnqczpcbljjmhnnrmzlpqbswwcjpjqcrtdmgprpmmbprwlmpzcmwlnbzqjsgftrncvmjmjwvqgszsrmrczhjnwlghgndhbthwlhfbncrwqfgnshrmdfhwmfvllhvbmmllwfbgrnrttpzffzvcfjfbrmdqfcfrdqsltpbbttnqnbncfhwghfbgwrltbhwmmlpczsvvdnwhchgfplnjsttsqvsznwvlwzgfnhfrrgplsfwrwnbfhblwtjpldjmzrglhppgsjsgzssbbgrrbdmpwhgjjmlfnpdbvtntcwrvltgfnrgwttvvjhqljjvvnmztwgzcclgbjnjspzwnpgtgvhhhqbzrnvmdcljcdncvpnpdhrhqwvlhllbsrmjbzlgczwjsrvqrqfqmtjrnpbtdhsrfbhrgtgnrmlgcwcmrvrdfcqbfcqczjchgrjpzqfqqmcpvnvbrssfrfsrjmlngplqqsnclgvpfhjbzdppjftlgbmcgdbrvqrclvtdnzhhcmzlrdrgbrqrlvfcnvznnqwswvhdpbbjmsqzcrmjngzmdftjzsjvgfdtcvdwhnwwjlcgcmflzzpzpgzrvmptbjgrdjbzscrglhcjppdjdshnvvbsnnddtbwsdrpnbnlrtppcrzbbjrfzhbwgmjqtmgjvmrjgfdndlmqvhgwprsjnhcmrnfdfdzggjjzcccnsnwwbjzmsfjjfhclptfcwqjhnphpwzszjmsrtnbqpqsvcfcvrrgclwlbrqngdcdlzrdfpvbgtznjzdvjngrgswhjnrpgswtqflpgvnpbsvcrtgtzcbhdjpbjwnpdzcmprtzlppbqvpzrrlbssmwhhvqqpmwggnzwcfdnzccjrrncnvjqgbpstctwpqvhdsbcsjrpbzbdlwwvjngtbnvpthppglgsnrbwnvpzldhsgwqhclgwrdsvcfdclvdsbrhcfnbgrtqswstnjfmfrdgphpvgjfqzcwnpcghdhtflgdnhhnnnwrpnmppszgqdcqjqpnccfsqjsmwtqvzwfqvtwtthwswmcqqcqjwcgwgzgmnpzbfpzrqbvqhbhtsvvbppbmqzfnsmwppzvsctgcncztsqdfhnlwjjtvwcchvnphwpnpzqsjhlrcmnbthtqlfclnsfdtpwfzljdpfszvhgzdpzhbjtphbfbmwgfrfplntfqhgpbjzghmblzzhdcbptngqwrtfmvtbhphpvdwpswbscrwzhnvqfwlbwwqqgstgmbqlllspbhbpjmmrfhmjwzdnsdwmpvlrspgzmdjwqwcjpbgwspsghjdvrbbsbtgwptqdvvdhbhqbdhpbzdsdwsjdbjnztdqqrdhwhtpvcbblbmjgmbpqghdsfthzjffrdvldfsnpcsmnzwzcqlnvcrcbqnfcdrfbffrvhqsbqjnnbzsqvqqdqwmsvbqvtgmnnlthpngfsljqnrdhhzpmwsnqvrgdnvlbgnndfcpjfgmzqssvnnrwbmslcqpnhnnwzggsjvqcsqpfzjcmcppntmsdtfggzdncqbfjsqvbzgnnlsdbgjqffsmvnbqlsrjwdmcjbrsrpchnnhdtlcdhfdltmlvtrwjpzphtbhzzrlrwbbhhpntgbcfmphnbrjdhrhvmvhfglrncngjdsvbfrqtqzsgvlzjqzcqnwdcfgvnpsqpphwfsdvpgnchjnnjhsqgvlqcvhzzzcrsqcvrbsbjbdbgddlbb'

const main1 = s => {
	const marker = []
	for (let i = 0; i < s.length; i++) {
		const c = s[i]
		marker.push(c)
		if (marker.length < 5) continue
		marker.shift()
		if ([...new Set(marker)].length === marker.length) return i + 1
	}
}

const main2 = s => {
	const marker = []
	for (let i = 0; i < s.length; i++) {
		const c = s[i]
		marker.push(c)
		if (marker.length < 15) continue
		marker.shift()
		if ([...new Set(marker)].length === marker.length) return i + 1
	}
}

const main = await main2(input)
console.log(main)

