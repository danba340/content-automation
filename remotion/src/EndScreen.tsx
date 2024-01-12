import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FPS } from "./config";
import { msToFrame } from "./utils";
import { BG_BLACK, BG_GREY, TEXT_WHITE } from "./Composition";
import { loadFont } from "@remotion/google-fonts/IBMPlexSans";
const { fontFamily } = loadFont();

function fadeIn(currentFrame: number, endDurationInFrames: number, totalVideoDuration: number, fadeDurationFrames: number) {
	const opacity = interpolate(currentFrame, [totalVideoDuration - endDurationInFrames - fadeDurationFrames, totalVideoDuration - endDurationInFrames], [0, 0.5])
	return opacity;
}

export function EndScreen({ durationInFramesInput }: { durationInFramesInput: number }) {
	const fadeDurationMs = 500;
	const fadeDurationFrames = msToFrame(fadeDurationMs)
	const totalVideoDurationFrames = durationInFramesInput
	const currentFrame = useCurrentFrame()
	const endDurationFrames = FPS * 10;
	const showAfterFrame = totalVideoDurationFrames - endDurationFrames - fadeDurationFrames;
	console.log("showafterframe", showAfterFrame, totalVideoDurationFrames, endDurationFrames, fadeDurationFrames);
	if (currentFrame < showAfterFrame) {
		return null
	}
	const opacity = fadeIn(currentFrame, endDurationFrames, totalVideoDurationFrames, fadeDurationFrames);
	console.log("Opacity", opacity)

	return (
		<AbsoluteFill style={{ opacity, fontFamily, background: BG_BLACK }} className="items-center justify-center">
			<Img style={{ opacity: 0.7, height: "100%", }} className='absolute' placeholder={"me"} src={staticFile("profile.jpeg")} />
			<AbsoluteFill className="items-center justify-center">
				<div style={{ background: BG_GREY, bottom: "10%" }} className='shadow-xl absolute p-8 rounded-xl flex flex-col justify-between'>
					<h1 style={{ color: TEXT_WHITE }} className='text-5xl px-12 pt-5 pb-8 leading-normal'>Thanks for watching</h1>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	)
	// return (
	// 	<AbsoluteFill>
	// 		<div style={{ background: BG_BLACK, width: "100%", height: "200vh" }} className='flex w-full justify-center items-center'>
	// 			<Img style={{ opacity, height: "100%", top: 0, }} className='absolute' placeholder={"me"} src={staticFile("profile.jpeg")} />
	// 		</div>
	// 	</AbsoluteFill>
	// )
}