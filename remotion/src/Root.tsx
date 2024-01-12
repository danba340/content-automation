import { Composition } from 'remotion';
import { Video, Thumbnail, videoSchema, thumbSchema } from './Composition';
import './style.css';
import { FPS } from './config';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="Video"
				component={Video}
				durationInFrames={240} // NOT USED, see metadata below for cli and durationInFramesInput for dev
				fps={30}
				width={1920}
				height={1080}
				schema={videoSchema}
				defaultProps={{
					title: 'Default title',
					transcript: [{ "text": "Default", "start": 90, "end": 206, "confidence": 1, "speaker": null }],
					introDurationInFrames: 30 * 2, // 2s
					voiceOverPath: "voiceover.mp3",
					durationInFramesInput: "400",
				}}
				calculateMetadata={async ({ props }) => {
					return {
						durationInFrames: parseInt(props.durationInFramesInput)
					};
				}}
			/>
			<Composition
				id="Thumbnail"
				component={Thumbnail}
				durationInFrames={1}
				fps={30}
				width={1280}
				height={720}
				schema={thumbSchema}
				defaultProps={{
					text: 'My Husky saved my life',
				}}
			/>
		</>
	);
};
