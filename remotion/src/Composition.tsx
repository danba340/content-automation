import { AbsoluteFill, Sequence } from 'remotion';
import { z } from 'zod';
import { loadFont } from "@remotion/google-fonts/IBMPlexSans";
const { fontFamily } = loadFont();
import { getAvailableFonts } from "@remotion/google-fonts";
import { RedditCard } from './RedditCard';
import { Subtitles } from './Subtitles';
import { Music } from './Music';
import { Voiceover } from './Voiceover';
import { EndScreen } from './EndScreen';
import { thumbnailTextLengthToTextSize } from './utils';
import { RedditCardFullScreen } from './RedditCardFullscreen2';
import { BackgroundVideo } from './BackgroundVideo';

console.log(getAvailableFonts());

export const BG_BLACK = "#030303"
export const BG_GREY = "#1a1a1b"
export const TEXT_WHITE = "rgb(215, 218, 220)"
// const TEXT_GREY = "rgb(129, 131, 132)"

export const videoSchema = z.object({
	title: z.string(),
	transcript: z.object({
		start: z.number(),
		end: z.number(),
		text: z.string()
	}).array(),
	voiceOverPath: z.string(),
	introDurationInFrames: z.number(),
	durationInFramesInput: z.string(),
});

export const Video: React.FC<z.infer<typeof videoSchema>> = ({
	title,
	transcript,
	introDurationInFrames,
	durationInFramesInput: durationInFramesInputStr,
	voiceOverPath,
}) => {
	// title = title.length > 207 ? title.substring(0, 207) + "..." : title;
	const durationInFramesInput = parseInt(durationInFramesInputStr);
	return (
		<AbsoluteFill style={{ fontFamily }} className="bg-gray-100 items-center justify-center">
			<Music seed={durationInFramesInput} />
			<Voiceover path={voiceOverPath} />
			<AbsoluteFill>
				{/* <RVideo loop muted={true} startFrom={startFrame} src={staticFile(video.file)} /> */}
				<BackgroundVideo title={title} durationInFramesInput={durationInFramesInput} />
			</AbsoluteFill>
			<Sequence durationInFrames={introDurationInFrames} >
				<div className='flex w-full justify-center items-center'>
					<RedditCard title={title} introDurationInFrames={introDurationInFrames} />
				</div>
			</Sequence>
			<div className='flex w-full justify-center items-end h-full mb-12'>
				<Subtitles words={transcript} />
			</div>
			<EndScreen durationInFramesInput={durationInFramesInput} />
		</AbsoluteFill>
	);
};

export const thumbSchema = z.object({
	text: z.string(),
});

export const Thumbnail: React.FC<z.infer<typeof thumbSchema>> = ({
	text
}) => {
	let textSizeClass = thumbnailTextLengthToTextSize(text.length)
	console.log("textSizeClass", textSizeClass)
	return (
		<RedditCardFullScreen title={text} />
	);
	// <AbsoluteFill style={{ fontFamily, background: BG_BLACK }} className="items-center justify-center">
	// 	<Img style={{ opacity: 0.5, height: "100%", left: "-12%" }} className='absolute' placeholder={"me"} src={staticFile("profile.jpeg")} />
	// 	<AbsoluteFill className="items-center justify-center">
	// 		<div style={{ background: BG_GREY, width: "70%", right: "3%" }} className='shadow-xl absolute p-8 rounded-xl flex flex-col justify-between'>
	// 			<div className='flex'>
	// 				<Img style={{ borderRadius: "50%", width: 100, height: 100 }} placeholder={""} src={staticFile("avatar_reddit.png")} />
	// 				<div className='flex flex-col'>
	// 					<div className='flex pl-12 gap-2'>
	// 						<Img style={{ height: 25 }} placeholder={""} src={staticFile("reactions.png")} />
	// 					</div>
	// 					<h1 style={{ color: TEXT_WHITE }} className={`${textSizeClass} pl-12 pt-3 pb-8 leading-normal`}>{text}</h1>
	// 				</div>
	// 			</div>
	// 			<div style={{ color: TEXT_WHITE }} className=''>
	// 				<Img className='ml-[-18px]' style={{ height: 60 }} placeholder={""} src={staticFile("cardbottom.png")} />
	// 			</div>
	// 		</div>
	// 	</AbsoluteFill>
	// </AbsoluteFill>
};
