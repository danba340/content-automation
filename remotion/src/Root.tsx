import { Composition } from 'remotion';
import { Video, Thumbnail, videoSchema, thumbSchema } from './Composition';
import './style.css';

export const RemotionRoot: React.FC = () => {

	return (
		<>
			<Composition
				id="video-comp-id"
				component={Video}
				durationInFrames={240}
				fps={30}
				width={1920}
				height={1080}
				schema={videoSchema}
				defaultProps={{
					title: 'My Husky saved my life',
					transcript: [{ "text": "My", "start": 90, "end": 206, "confidence": 1, "speaker": null }, { "text": "husky", "start": 228, "end": 586, "confidence": 0.73596, "speaker": null }, { "text": "saved", "start": 618, "end": 906, "confidence": 0.99666, "speaker": null }, { "text": "my", "start": 938, "end": 1086, "confidence": 1, "speaker": null }, { "text": "life.", "start": 1108, "end": 1486, "confidence": 1, "speaker": null }, { "text": "I", "start": 1588, "end": 1806, "confidence": 1, "speaker": null }, { "text": "was", "start": 1828, "end": 1966, "confidence": 1, "speaker": null }, { "text": "living", "start": 1988, "end": 2174, "confidence": 1, "speaker": null }, { "text": "with", "start": 2212, "end": 2366, "confidence": 1, "speaker": null }, { "text": "my", "start": 2388, "end": 2526, "confidence": 1, "speaker": null }, { "text": "dad", "start": 2548, "end": 2826, "confidence": 1, "speaker": null }, { "text": "and", "start": 2858, "end": 3006, "confidence": 1, "speaker": null }, { "text": "brother", "start": 3028, "end": 3274, "confidence": 0.98933, "speaker": null }, { "text": "at", "start": 3322, "end": 3438, "confidence": 1, "speaker": null }, { "text": "the", "start": 3444, "end": 3566, "confidence": 1, "speaker": null }, { "text": "time.", "start": 3588, "end": 3966, "confidence": 1, "speaker": null }, { "text": "I", "start": 4068, "end": 4334, "confidence": 1, "speaker": null }, { "text": "believe", "start": 4372, "end": 4574, "confidence": 1, "speaker": null }, { "text": "I", "start": 4612, "end": 4766, "confidence": 0.83, "speaker": null }, { "text": "was", "start": 4788, "end": 4974, "confidence": 1, "speaker": null }, { "text": "1112", "start": 5012, "end": 6430, "confidence": 0.84, "speaker": null }, { "text": "years", "start": 6500, "end": 6782, "confidence": 0.97967, "speaker": null }, { "text": "old.", "start": 6836, "end": 7102, "confidence": 1, "speaker": null }, { "text": "When", "start": 7156, "end": 7326, "confidence": 0.99997, "speaker": null }, { "text": "I", "start": 7348, "end": 7486, "confidence": 1, "speaker": null }, { "text": "was", "start": 7508, "end": 7646, "confidence": 1, "speaker": null }, { "text": "living", "start": 7668, "end": 7854, "confidence": 0.99998, "speaker": null }, { "text": "with", "start": 7892, "end": 8046, "confidence": 1, "speaker": null }, { "text": "my", "start": 8068, "end": 8206, "confidence": 1, "speaker": null }, { "text": "dad.", "start": 8228, "end": 8522, "confidence": 0.99856, "speaker": null }, { "text": "My", "start": 8586, "end": 8814, "confidence": 1, "speaker": null }, { "text": "brother", "start": 8852, "end": 9114, "confidence": 0.99983, "speaker": null }, { "text": "and", "start": 9162, "end": 9278, "confidence": 1, "speaker": null }, { "text": "I", "start": 9284, "end": 9502, "confidence": 0.98, "speaker": null }, { "text": "felt", "start": 9556, "end": 9834, "confidence": 0.99986, "speaker": null }, { "text": "uncomfortable", "start": 9882, "end": 10474, "confidence": 0.68692, "speaker": null }, { "text": "with", "start": 10522, "end": 10734, "confidence": 0.54, "speaker": null }, { "text": "him", "start": 10772, "end": 10974, "confidence": 1, "speaker": null }, { "text": "and", "start": 11012, "end": 11166, "confidence": 1, "speaker": null }, { "text": "his", "start": 11188, "end": 11374, "confidence": 1, "speaker": null }, { "text": "life", "start": 11412, "end": 11614, "confidence": 1, "speaker": null }, { "text": "choices.", "start": 11652, "end": 12510, "confidence": 0.99986, "speaker": null }, { "text": "So", "start": 12930, "end": 13294, "confidence": 1, "speaker": null }, { "text": "when", "start": 13332, "end": 13486, "confidence": 0.99989, "speaker": null }, { "text": "our", "start": 13508, "end": 13646, "confidence": 1, "speaker": null }, { "text": "dad", "start": 13668, "end": 13914, "confidence": 0.99927, "speaker": null }, { "text": "would", "start": 13962, "end": 14078, "confidence": 0.99996, "speaker": null }, { "text": "be", "start": 14084, "end": 14206, "confidence": 1, "speaker": null }, { "text": "under", "start": 14228, "end": 14414, "confidence": 0.58902, "speaker": null }, { "text": "the", "start": 14452, "end": 14654, "confidence": 1, "speaker": null }, { "text": "influence", "start": 14692, "end": 15146, "confidence": 0.76499, "speaker": null }, { "text": "of", "start": 15178, "end": 15326, "confidence": 1, "speaker": null }, { "text": "Alcy", "start": 15348, "end": 15834, "confidence": 0.16917, "speaker": null }, { "text": "or", "start": 15882, "end": 16094, "confidence": 1, "speaker": null }, { "text": "D", "start": 16132, "end": 16334, "confidence": 0.78, "speaker": null }, { "text": "asterisk", "start": 16372, "end": 16954, "confidence": 0.99904, "speaker": null }, { "text": "uggs,", "start": 17002, "end": 17790, "confidence": 0.90059, "speaker": null }, { "text": "we", "start": 18690, "end": 19054, "confidence": 0.99999, "speaker": null }, { "text": "went", "start": 19092, "end": 19246, "confidence": 1, "speaker": null }, { "text": "on", "start": 19268, "end": 19406, "confidence": 1, "speaker": null }, { "text": "walks", "start": 19428, "end": 19738, "confidence": 0.99991, "speaker": null }, { "text": "around", "start": 19754, "end": 19934, "confidence": 0.99999, "speaker": null }, { "text": "the", "start": 19972, "end": 20078, "confidence": 1, "speaker": null }, { "text": "neighborhood.", "start": 20084, "end": 20794, "confidence": 0.72664, "speaker": null }, { "text": "Our", "start": 20922, "end": 21214, "confidence": 0.62, "speaker": null }, { "text": "neighborhood", "start": 21252, "end": 21722, "confidence": 0.84726, "speaker": null }],
					introDurationInFrames: 30 * 2, // 2s
					voiceOverPath: "voiceover.mp3"
				}}
			/>
			<Composition
				id="thumbnail-comp-id"
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
