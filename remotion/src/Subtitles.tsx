import { Word, WordConfig, WordType } from "./Word"

const word: WordType = {
	start: 0,
	end: 9999,
	text: "Test"
}

const config: WordConfig = {
	start: 0,
	end: 9999,
	transitionInDuration: 10,
	transitionOutDuration: 10,
	transitionInStyle: "fade",
	transitionOutStyle: "fade",
	outlineColor: "black",
	outlineThickness: 10,
	color: "white",
	scale: 100,
	opacity: 1,
}

export function Subtitles() {
	return <Word word={word} config={config} />
}