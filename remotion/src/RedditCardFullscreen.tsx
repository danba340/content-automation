import { Img, staticFile, AbsoluteFill } from "remotion"
import { loadFont } from "@remotion/google-fonts/IBMPlexSans";
import { BG_GREY, TEXT_WHITE } from "./Composition";
const { fontFamily } = loadFont();

const BG_COLORS = [
	"#cc2b5e", // Pink
	"#753a88", // Purple
	"#ffe259", // Yellow
	"#ffa751", // Orange
	"#6dd5ed", // Blue
	"#6be585", // Green
	"#ec2F4B", // Red
]

const AVATARS = [
	"avatar_reddit.png",
	"avatar_reddit2.png",
	"avatar_reddit3.png",
	"avatar_reddit4.png",
]

function twoRandomColors(seed: string) {
	if (seed.length < 2) {
		console.log("twoRandomIndexes: seed must be of length 2 or longer")
		return [0, 0];
	}
	const r1 = seed.charCodeAt(0);
	const r2 = seed.charCodeAt(1);

	const i1 = r1 % BG_COLORS.length;
	const i2 = r2 % BG_COLORS.length;

	return [BG_COLORS[i1], BG_COLORS[i2]]
}

function randomIndex(seed: number, maxIndex: number) {
	return seed % maxIndex;
}

export function textLengthToTextSize(l: number) {
	if (l < 31) {
		return 'text-9xl';
	}
	if (l < 65) {
		return 'text-8xl';
	}
	if (l < 105) {
		return 'text-7xl';
	}
	if (l < 155) {
		return 'text-6xl';
	}
	return 'text-5xl';
}


// TODO make almost full screen, make random gradient from a set of colors, Use random reddit avatar, 
export function RedditCardFullScreen({ title }: { title: string }) {
	title = title.length > 280 ? title.substring(0, 277) + "..." : title;
	let textSizeClass = textLengthToTextSize(title.length)
	console.log("textSizeClass", textSizeClass)
	let avatar = AVATARS[randomIndex(title.length, AVATARS.length)]
	let [color1, color2] = twoRandomColors(title)
	let background = `linear-gradient(to right, ${color1}, ${color2})`
	return (
		<AbsoluteFill style={{
			fontFamily, background,
			// width: "100%", height: "100vh" 
		}} className="items-center justify-center">
			<div style={{ background: BG_GREY, width: "97%", height: "95%" }} className='shadow-xl absolute p-8 rounded-xl flex flex-col justify-between'>
				<div className='flex'>
					<Img style={{ borderRadius: "50%", width: 100, height: 100 }} placeholder={""} src={staticFile(avatar)} />
					<div className='flex flex-col'>
						<div className='flex pl-12 gap-2'>
							<Img style={{ height: 35 }} placeholder={""} src={staticFile("reactions.png")} />
						</div>
						<h1 style={{ color: TEXT_WHITE }} className={`${textSizeClass} pl-12 pt-3 pb-8 leading-normal`}>{title}</h1>
					</div>
				</div>
				<div style={{ color: TEXT_WHITE }} className=''>
					<Img className='ml-[-18px]' style={{ height: 60 }} placeholder={""} src={staticFile("cardbottom.png")} />
				</div>
			</div>
		</AbsoluteFill>
	)
}