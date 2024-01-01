// @ts-ignore
import ElevenLabs from 'elevenlabs-node';
import { ELEVEN_LABS_VOICE_NAME, ENV } from './config.js';

const VOICENAME_TO_ID = {
  nicole: 'piTKgcLEGmPE4e6mEKli',
} as const;

const voiceId = VOICENAME_TO_ID[ELEVEN_LABS_VOICE_NAME];

const api = new ElevenLabs({
  apiKey: ENV.ELEVEN_LABS_API_KEY,
  voiceId,
});

function toSentencedChunks(text: string, maxLength: number) {
  return text.split('TODO');
}

export async function createVoiceover(textInput: string, slug: string) {
  const files = [];
  const maxLength = 1000;
  let chunks = toSentencedChunks(textInput, maxLength);
  for (const [i, chunk] of Object.entries(chunks)) {
    const fileName = `./projects/${slug}/voiceover-${i}.mp3`;
    files.push(fileName);
    await api
      .textToSpeech({
        // Required Parameters
        fileName,
        textInput: chunk,

        // Optional Parameters
        voiceId,
        stability: 0.5, // The stability for the converted speech
        similarityBoost: 0.5, // The similarity boost for the converted speech
        modelId: 'elevenlabs_multilingual_v2', // The ElevenLabs Model ID
        style: 1, // The style exaggeration for the converted speech
        speakerBoost: true, // The speaker boost for the converted speech
      })
      .catch((err: unknown) => {
        console.log('Elevenlabs api err', err);
        process.exit(1);
      });
  }
  return files;
}
