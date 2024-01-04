import { Composition } from 'remotion';
import { Video, Thumbnail, videoSchema, thumbSchema } from './Composition';
import './style.css';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="video"
				component={Video}
				durationInFrames={240}
				fps={30}
				width={1920}
				height={1080}
				schema={videoSchema}
				defaultProps={{
					title: 'Welcome to Remotion with Tailwind CSS',
					text: "This is text"
				}}
			/>
			<Composition
				id="thumbnail"
				component={Thumbnail}
				durationInFrames={1}
				fps={30}
				width={1280}
				height={720}
				schema={thumbSchema}
				defaultProps={{
					text: 'This is thumbnail',
				}}
			/>
		</>
	);
};