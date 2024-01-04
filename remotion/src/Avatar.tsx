import { Img, staticFile } from 'remotion';

export function Avatar(size: number) {
	return (
		<Img style={{ width: `${size}px`, borderRadius: size }} placeholder={"me"} src={staticFile("profile.jpeg")} />
	)
}