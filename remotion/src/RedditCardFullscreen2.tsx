import { Img, staticFile, AbsoluteFill, interpolate } from "remotion"
// @ts-ignore
import pos from "pos";
import { loadFont } from "@remotion/google-fonts/IBMPlexSans";
import { BG_GREY, TEXT_WHITE } from "./Composition";
const { fontFamily } = loadFont();

const TEXT_COLORS = [
	"#cc2b5e", // Pink
	"#753a88", // Purple
	"#ffe259", // Yellow
	"#ffa751", // Orange
	"#6dd5ed", // Blue
	"#6be585", // Green
]

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

const IMAGES = [
	{ width: 700, path: "surprised1.png", pad: 0, marginRight: -150 },
	{ width: 700, path: "surprised3.png", pad: 0, marginRight: -150 },
	{ width: 700, path: "surprised4.png", pad: 0, marginRight: -150 },
	{ width: 530, path: "woman.png", pad: 0, marginRight: -150 },
	{ width: 600, path: "hot1.png", pad: 0, marginRight: -150 },
	{ width: 300, path: "square-frost.png", pad: 18, marginRight: 40, center: true },
	{ width: 300, path: "shock-square.png", pad: 18, marginRight: 50, center: true },
]

function threeRandomColors(seed: string, colors: string[]) {
	if (seed.length < 3) {
		console.log("twoRandomIndexes: seed must be of length 3 or longer")
		return [0, 0, 0];
	}
	const r1 = seed.charCodeAt(0);
	const r2 = seed.charCodeAt(1);
	const r3 = seed.charCodeAt(2);

	const i1 = r1 % BG_COLORS.length;
	const i2 = r2 % BG_COLORS.length;
	const i3 = r3 % BG_COLORS.length;

	return [BG_COLORS[i1], BG_COLORS[i2], BG_COLORS[i3]]
}

function randomIndex(seed: number, maxIndex: number) {
	return seed % maxIndex;
}

function fontSizeFromTextLength(l: number) {
	return interpolate(l, [30, 50, 155, 250], [6, 5.3, 3, 2.5], { extrapolateLeft: "extend", extrapolateRight: "extend" })
}

export function textLengthToTextSize(l: number) {
	if (l < 31) {
		return 'text-8xl'; //6
	}
	if (l < 65) {
		return 'text-7xl';
	}
	if (l < 105) {
		return 'text-6xl';
	}
	if (l < 155) {
		return 'text-5xl';
	}
	return 'text-4xl'; // 2.25
}



export function RedditCardFullScreen({ title }: { title: string }) {
	title = title.length > 280 ? title.substring(0, 277) + "..." : title;
	let textSizeClass = textLengthToTextSize(title.length)
	console.log("textSizeClass", textSizeClass)
	let avatar = AVATARS[randomIndex(title.length, AVATARS.length)]
	let image = IMAGES[randomIndex(title.length, IMAGES.length)]
	let [bg_color1, bg_color2] = threeRandomColors(title, BG_COLORS)
	let background = `linear-gradient(to right, ${bg_color1}, ${bg_color2})`
	let [color1, color2, color3] = threeRandomColors(title, TEXT_COLORS)
	const fontSize = fontSizeFromTextLength(title.length);
	const wordTypeToColor = {
		"NN": color1, // Noun
		"NNP": color1, // Noun
		"NNPS": color1, // Noun
		"NNS": color1, // Noun
		"VB": color2, // Verb
		"VBD": color2, // Verb
		"VBG": color2, // Verb
		"VBN": color2, // Verb
		"VBP": color2, // Verb
		"VBZ": color2, // Verb
		"JJ": color3, // Adjective
		"RB": color3, // Adverb
		"RBR": color3, // Adjective
		"RBS": color3, // Adjective
	}
	const lexedWords = new pos.Lexer().lex(title);
	const tagger = new pos.Tagger();
	const taggedWords = tagger.tag(lexedWords);
	const words = taggedWords.map((w: string[], i: number) => {
		const word = w[0];
		const tag = w[1];
		const noSpace = {
			word,
			tag,
			spaceAfter: false
		}
		if (word === "'") {
			return noSpace
		}
		const wordAfter = taggedWords[i + 1];
		if (!wordAfter) {
			return noSpace
		}
		const wordAfterText = wordAfter[0]
		if (wordAfterText === "," || wordAfterText === "'") {
			return noSpace
		}
		const wordAfterTag = wordAfter[1]
		if (wordAfterTag === ".") {
			return noSpace
		}
		return ({
			word,
			tag,
			spaceAfter: true
		})
	})


	return (
		<AbsoluteFill style={{
			fontFamily, background,
			// width: "100%", height: "100vh" 
		}} className="relative items-center justify-center">
			<div style={{ background: BG_GREY, width: "97%", height: "95%" }} className='overflow-hidden shadow-xl absolute rounded-3xl'>
				<div style={{ height: "100%" }} className=''>
					<div className="flex">
						<Img className="p-8 inline-block" style={{ borderRadius: "50%", width: 150, height: 150 }} placeholder={""} src={staticFile(avatar)} />
						<div style={{ height: "calc(100% - 50px)" }} className="flex flex-col pt-1">
							<Img className="inline-block pt-8 pl-6" style={{ width: 200, }} placeholder={""} src={staticFile("reactions.png")} />
							<Img className='pt-2' style={{ height: 60 }} placeholder={""} src={staticFile("cardbottom.png")} />
						</div>
					</div>
					<div className='pl-8 flex'>
						<h1 style={{ fontSize: `${fontSize}rem`, maxWidth: "70%", minHeight: "100%", color: TEXT_WHITE, zIndex: 10 }} className={`pt-3 leading-normal`}>
							{words.map((w: { word: string, tag: string, spaceAfter: boolean }) => {
								// @ts-ignore
								const maybeColor = wordTypeToColor[w.tag]
								return (
									<span style={{ textShadow: `3px 4px ${BG_GREY}`, color: maybeColor || TEXT_WHITE }}>{w.word}{w.spaceAfter ? " " : ""}</span>
								)
							})}
						</h1>
					</div>
					<AbsoluteFill style={{ height: "100%" }} className={`items-end justify-${image.center ? "center" : "end"}`}>
						<Img className={image.center ? "" : "inline-block absolute bottom-0"} style={{
							// alignSelf: "center",
							// textAlign: "right",
							// width: 200,
							// marginLeft: "auto",
							width: image.width,
							// paddingBottom: image.pad,
							// paddingRight: image.pad,
							marginRight: image.marginRight,
							// marginLeft: image.marginRight,
						}} placeholder={""} src={staticFile(image.path)} />
					</AbsoluteFill>
				</div>
				{/* <div style={{ color: TEXT_WHITE }} className=''>
					<Img className='ml-[-18px]' style={{ height: 60 }} placeholder={""} src={staticFile("cardbottom.png")} />
				</div> */}
			</div>
		</AbsoluteFill>
	)
}