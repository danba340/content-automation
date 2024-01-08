import { useCurrentFrame } from "remotion"
import { frameToMs } from "./utils"
import { Word, WordConfig, WordType } from "./Word"
// import { WordTriplet } from "./WordTriple"
// import { FPS } from "./config"

const words: WordType[] = [
	{
		start: 0,
		end: 500,
		text: "First"
	},
	{
		start: 501,
		end: 1000,
		text: "Second"
	},
	{
		start: 1001,
		end: 1500,
		text: "Third"
	},
	{
		start: 1501,
		end: 2000,
		text: "Forth"
	},
	{
		start: 2001,
		end: 2500,
		text: "Fifth"
	},
]

// const word: WordType = {
// 	start: 0,
// 	end: 9999,
// 	text: "TEST SOME Text"
// }

const config: WordConfig = {
	start: 0,
	end: 9999,
	transitionInDuration: 10,
	transitionOutDuration: 10,
	transitionInStyle: "fade",
	transitionOutStyle: "fade",
	outlineColor: "black",
	outlineThickness: 3,
	color: "white",
	scale: 100,
	opacity: 1,
}

function getIndexOfClosestWord(words: WordType[], ms: number) {
	let closestIndex = -1;
	let closestMs = Number.MAX_SAFE_INTEGER;
	for (const [i, word] of Object.entries(words)) {
		let distanceToStart = Math.abs(ms - word.start);
		let distanceToEnd = Math.abs(ms - word.end);
		let msToWord = Math.min(distanceToStart, distanceToEnd)
		if (msToWord <= closestMs) {
			closestIndex = parseInt(i);
			closestMs = msToWord;
		}
	}
	return closestIndex;
}

export function Subtitles() {
	const frame = useCurrentFrame();
	const ms = frameToMs(frame);

	return (
		<>
			{words.map((w, i) => {
				let wordIndex = getIndexOfClosestWord(words, ms)
				let word = words[wordIndex]
				if (w !== word) {
					return null
				}

				return <Word key={i} word={w} config={config} />
			})}
		</>
	)
}