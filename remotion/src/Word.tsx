import { useCurrentFrame, spring } from "remotion";
import { cleanSpecialChars, frameToMs, msToFrame, transitionAdjustSubtitle } from "./utils";
import { FPS } from "./config";
import { loadFont } from "@remotion/google-fonts/Alice";
const { fontFamily } = loadFont();

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

export function Word({ word, config }: { word: WordType, config: WordConfig }) {

	const frame = useCurrentFrame();
	const ms = frameToMs(frame)
	const wordStartFrame = msToFrame(word.start);

	const { outlineColor, outlineThickness, color, opacity } = transitionAdjustSubtitle(config, word, ms)

	// const shouldShow = word.start < ms && word.end > ms
	const text = cleanSpecialChars(word.text)

	console.log("WS", wordStartFrame)

	const scaleSpring = spring({
		frame: frame - wordStartFrame,
		fps: FPS,
		config: {
			stiffness: 110,
			// damping: 15,
			// overshootClamping: true
		},
		durationInFrames: 6,
	});
	console.log("Word", word.text, "scale", scaleSpring)
	const scaleFactor = 200
	const scale = scaleSpring * scaleFactor;
	const baseScale = scaleFactor * 3;

	return (//shouldShow ? (
		<svg
			style={{
				overflow: "visible",
				transform: `scale(${baseScale + scale}%)`,
			}}
		>
			<text
				style={{
					fontFamily,
					// letterSpacing: "1px"
				}}
				x="50%" y="50%" textAnchor='middle'>
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
	)// : null
}