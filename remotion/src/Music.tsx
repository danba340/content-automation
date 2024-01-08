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
].sort(() => Math.random() - 0.5)



export function Music() {
	let offsetSeconds = 0;
	return tracks.map((track, i) => {
		let currOffsetSeconds = offsetSeconds;
		let currOffsetFrames = msToFrame(currOffsetSeconds * 1000)
		offsetSeconds += track.seconds;
		return (<Sequence from={currOffsetFrames}>
			<Audio placeholder={null} src={staticFile(`/music/${track.name}.mp3`)} />
		</Sequence>)
	})
}