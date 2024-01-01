import { useCurrentFrame } from "remotion";
import { cleanSpecialChars, frameToMs, transitionAdjustSubtitle } from "./utils";

export type WordConfig = {
	start: number,
	end: number,
	transitionInDuration: number,
	transitionOutDuration: number,
	transitionInStyle: string,
	transitionOutStyle: string
	outlineColor: string,
	outlineThickness: number,
	color: string,
	scale: number,
	opacity: number
}

export type WordType = {
	start: number,
	end: number,
	text: string
}

export function Word({ word, config }: { config: WordConfig, word: WordType }) {

	const frame = useCurrentFrame();
	const ms = frameToMs(frame)

	const { outlineColor, outlineThickness, color, opacity, scale } = transitionAdjustSubtitle(config, word, ms)

	const shouldShow = word.start < ms && word.end > ms
	const text = cleanSpecialChars(word.text)

	return shouldShow ? (
		<svg
			style={{
				overflow: "visible",
				transform: `scale(${scale}%)`,
			}}
		>
			<text x="50%" y="50%" textAnchor='middle'>
				<tspan
					style={{
						fill: color,
						stroke: outlineColor,
						strokeWidth: outlineThickness,
						strokeLinejoin: "round",
						paintOrder: "stroke",
						opacity
					}}
				>
					{text}
				</tspan>
			</text>
		</svg>
	) : null
}