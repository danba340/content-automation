import { staticFile, Video as RVideo } from 'remotion';
import { FPS } from "./config";

const bgVideos = {
	cake: {
		file: "cake.mp4",
		startFrom: 11 * FPS,
		lengthInFrames: (10 * 60 + 19) * FPS
	},
	cosmetics: {
		file: "cosmetics.mp4",
		startFrom: 3 * FPS + 1,
		lengthInFrames: (8 * 60 + 46) * FPS
	},
	oddly1: {
		file: "oddly1.mp4",
		startFrom: 0,
		lengthInFrames: (12 * 60 + 36) * FPS
	},
	fpv1: {
		file: "fpv1.mp4",
		startFrom: 5 * FPS,
		lengthInFrames: (3 * 60 + 39) * FPS
	},
	fpv2: {
		file: "fpv2.mp4",
		startFrom: 0,
		lengthInFrames: (3 * 60 + 21) * FPS
	},
}

function getRandomStartingMinute(seed: number, maxValue: number) {
	return seed % maxValue;
}
function getRandomVideo(seed: number, durationInFrames: number) {
	const videos = Object.values(bgVideos).filter(v => {
		return v.lengthInFrames > durationInFrames + v.startFrom
	});
	const index = seed % videos.length;
	return videos[index]
}

export function BackgroundVideo({ title, durationInFramesInput }: { title: string, durationInFramesInput: number }) {
	const video = getRandomVideo(title.length, durationInFramesInput);
	const diffDuration = video.lengthInFrames - durationInFramesInput - video.startFrom;
	const minuteInFrames = 60 * FPS;
	const diffMinutes = Math.floor(diffDuration / minuteInFrames);
	const startMinute = getRandomStartingMinute(title.length, diffMinutes);
	const startFrame = startMinute * 60 * FPS + video.startFrom;
	return (
		<RVideo loop muted={true} startFrom={startFrame} src={staticFile(video.file)} />
	)
}