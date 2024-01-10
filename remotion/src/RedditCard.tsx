import { Img, staticFile, AbsoluteFill, useCurrentFrame, interpolate } from "remotion"
import { loadFont } from "@remotion/google-fonts/IBMPlexSans";
import { BG_GREY, TEXT_WHITE } from "./Composition";
import { msToFrame } from "./utils";
const { fontFamily } = loadFont();

function fadeOut(currentFrame: number, introDurationInFrames: number) {
	const fadeDurationMs = 500;
	const fadeDurationFrames = msToFrame(fadeDurationMs)
	const opacity = interpolate(currentFrame, [introDurationInFrames - fadeDurationFrames, introDurationInFrames], [1, 0])
	return opacity;
}

export function RedditCard({ title, introDurationInFrames }: { title: string, introDurationInFrames: number }) {
	const currentFrame = useCurrentFrame()
	const opacity = fadeOut(currentFrame, introDurationInFrames);

	return (
		<AbsoluteFill style={{ fontFamily, opacity }} className="items-center justify-center">
			<div style={{ background: BG_GREY, width: "60%" }} className='shadow-xl absolute p-8 rounded-xl flex flex-col justify-between'>
				<div className='flex'>
					<Img style={{ borderRadius: "50%", width: 100, height: 100 }} placeholder={""} src={staticFile("avatar_reddit.png")} />
					<div className='flex flex-col'>
						<div className='flex pl-12 gap-2'>
							<Img style={{ height: 25 }} placeholder={""} src={staticFile("reactions.png")} />
						</div>
						<h1 style={{ color: TEXT_WHITE }} className='text-5xl pl-12 pt-3 pb-8 leading-normal'>{title}</h1>
					</div>
				</div>
				<div style={{ color: TEXT_WHITE }} className=''>
					<Img className='pl-2' style={{ height: 60 }} placeholder={""} src={staticFile("cardbottom.png")} />
				</div>
			</div>
		</AbsoluteFill>
	)
}