import { Audio, staticFile } from "remotion"
export function Voiceover({ path }: { path: string }) {
	return <Audio placeholder={null} src={staticFile(`${path}`)} />
}