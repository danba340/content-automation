import { Sequence, Audio, staticFile } from "remotion"
import { msToFrame } from "./utils";

const tracks = [
	{ name: 1, seconds: 184 },
	{ name: 2, seconds: 141 },
	{ name: 3, seconds: 169 },
	{ name: 4, seconds: 137 },
	{ name: 5, seconds: 145 },
	{ name: 6, seconds: 180 + 34 },
	{ name: 7, seconds: 143 },
	{ name: 8, seconds: 181 },
]//.sort(() => Math.random() - 0.5)

function getPredictableRandomTrackIndex(seed: number) {
	return seed % tracks.length;
}

function arrayRotate(arr: any[], times: number) {
	for (let i = 0; i < times; i++) {
		arr.push(arr.shift());
	}
	return arr;
}

export function Music({ seed }: { seed: number }) {
	let rotations = getPredictableRandomTrackIndex(seed);
	arrayRotate(tracks, rotations);
	let offsetSeconds = 0;
	return tracks.map((track, i) => {
		let currOffsetSeconds = offsetSeconds;
		let currOffsetFrames = msToFrame(currOffsetSeconds * 1000)
		offsetSeconds += track.seconds;
		return (<Sequence key={track.name} from={currOffsetFrames}>
			<Audio volume={0.1} placeholder={null} src={staticFile(`/music/${track.name}.mp3`)} />
		</Sequence>)
	})
}