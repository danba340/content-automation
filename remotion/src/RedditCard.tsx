import { Img, staticFile } from "remotion"
import { loadFont } from "@remotion/google-fonts/IBMPlexSans";
const { fontFamily } = loadFont();

export function RedditCard({ title }: { title: string }) {
	return (
		<div className="text-4xl text-white justify-center p-8 flex rounded-3xl" style={{ width: "50%", height: "50%", background: "#0c0c0c" }}>
			<Img style={{ borderRadius: "50%", width: 200, height: 200 }} placeholder={""} src={staticFile("avatar_reddit.png")} />
			<h1 className="p-8 font-medium" style={{ fontFamily }}>
				{title}
			</h1>
		</div>
	)
}