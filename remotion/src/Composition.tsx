import { AbsoluteFill, Img, staticFile, Video as RVideo } from 'remotion';
import { z } from 'zod';
import { loadFont } from "@remotion/google-fonts/IBMPlexSans";
const { fontFamily } = loadFont();
import { getAvailableFonts } from "@remotion/google-fonts";
import { RedditCard } from './RedditCard';
import { Subtitles } from './Subtitles';

console.log(getAvailableFonts());

const BG_BLACK = "#030303"
const BG_GREY = "#1a1a1b"
const TEXT_WHITE = "rgb(215, 218, 220)"
// const TEXT_GREY = "rgb(129, 131, 132)"

export const videoSchema = z.object({
	title: z.string(),
	text: z.string(),
});

export const Video: React.FC<z.infer<typeof videoSchema>> = ({
	title,
	text
}) => {
	return (
		<AbsoluteFill style={{ fontFamily }} className="bg-gray-100 items-center justify-center">
			<AbsoluteFill>
				<RVideo src={staticFile("cake.mp4")} />
			</AbsoluteFill>
			<RedditCard />
			<Subtitles />
		</AbsoluteFill>
	);
};

export const thumbSchema = z.object({
	text: z.string(),
});

export const Thumbnail: React.FC<z.infer<typeof thumbSchema>> = ({
	text
}) => {
	return (
		<AbsoluteFill style={{ fontFamily, background: BG_BLACK }} className="items-center justify-center">
			<Img style={{ opacity: 0.5, height: "100%", left: "-12%" }} className='absolute' placeholder={"Girl"} src={staticFile("profile.jpeg")} />
			<AbsoluteFill className="items-center justify-center">

				<div style={{ background: BG_GREY, height: "98.5vh", width: "65%", right: "3%" }} className='shadow-xl absolute p-8 rounded-xl'>
					<h1 style={{ color: TEXT_WHITE }} className='text-4xl'>{text}</h1>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
