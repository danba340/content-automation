import { useCurrentFrame, spring } from "remotion";
import { cleanSpecialChars, frameToMs, transitionAdjustSubtitle } from "./utils";
import { loadFont } from "@remotion/google-fonts/Alice";
import { FPS } from "./config";
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

function Svg({ springy, scale: scaleFactor, scaleSpring, text, outlineThickness }: { springy: boolean, scaleSpring: number, scale: number, text: string, outlineThickness: number }) {
	const frame = useCurrentFrame();


	const scale = scaleFactor * scaleSpring;

	return (
		<svg
			style={{
				overflow: "visible",
				transform: `scale(${scale}%)`,
			}}
		>
			<text
				style={{
					fontFamily,
					fontSize: 100,
					// letterSpacing: "1px"
				}}
				x="50%" y="50%" textAnchor='middle'>
				<tspan
					style={{
						fill: "white",
						stroke: "black",
						strokeWidth: outlineThickness,
						strokeLinejoin: "round",
						paintOrder: "stroke",
						opacity: 1,
					}}
				>
					{text}
				</tspan>
			</text>
		</svg>
	)
}

export function WordTriplet({ wordTriplet, config, scaleSpring }: { scaleSpring: number, config: WordConfig, wordTriplet: (WordType | null)[] }) {
	if (!wordTriplet[1]) return

	const frame = useCurrentFrame();
	const ms = frameToMs(frame)
	const shouldShow = wordTriplet[1]!.start < ms && wordTriplet[1]!.end > ms
	if (!shouldShow) return null;

	const { outlineThickness } = transitionAdjustSubtitle(config, wordTriplet[1], ms)
	const scale = 100;

	return (
		<div className="flex justify-center">
			{
				wordTriplet[0] ? (<Svg scaleSpring={scaleSpring} springy={false} scale={scale * 0.5} text={cleanSpecialChars(wordTriplet[0].text)} outlineThickness={outlineThickness} />) : null
			}
			{
				wordTriplet[1] ? (<Svg scaleSpring={scaleSpring} springy={true} scale={scale} text={cleanSpecialChars(wordTriplet[1].text)} outlineThickness={outlineThickness} />) : null
			}
			{
				wordTriplet[2] ? (<Svg scaleSpring={scaleSpring} springy={false} scale={scale * 0.5} text={cleanSpecialChars(wordTriplet[2].text)} outlineThickness={outlineThickness} />) : null
			}
		</div>
	)
}