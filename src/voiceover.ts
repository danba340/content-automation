import axios from 'axios';
// @ts-ignore
import audioconcat from 'audioconcat';

import fs from 'fs';
import { ELEVEN_LABS_VOICE_NAME, ENV } from './config.js';
import { preprocessTextVoiceover, toSentencedChunks } from './text.js';

const VOICENAME_TO_ID = {
  nicole: 'piTKgcLEGmPE4e6mEKli',
} as const;

const voiceId = VOICENAME_TO_ID[ELEVEN_LABS_VOICE_NAME];

export async function mergeAudio(slug: string, paths: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const path = `./projects/${slug}/voiceover.mp3`;
    audioconcat(paths)
      .concat(path)
      .on('error', function (err: any) {
        console.error('Error:', err);
        reject();
      })
      .on('end', function () {
        resolve(path);
      });
  });
}

export async function createVoiceover(title: string, content: string, slug: string) {
  const cwd = process.cwd();
  const files = [];
  const maxLength = 300;
  let chunks = toSentencedChunks(preprocessTextVoiceover(content), maxLength).map((c) => c.trim());
  chunks.unshift(preprocessTextVoiceover(title).trim() + '.');
  console.log(`Voiceover split into ${chunks.length}`);
  for (const [i, chunk] of Object.entries(chunks)) {
    console.log(`Generating chunk ${parseInt(i) + 1}/${chunks.length}`);
    const fileName = `${cwd}/projects/${slug}/voiceover-${parseInt(i) + 1}.mp3`;
    files.push(fileName);

    const apiRequestOptions = {
      method: 'POST',
      url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      headers: {
        accept: 'audio/mpeg',
        'content-type': 'application/json',
        'xi-api-key': ENV.ELEVEN_LABS_API_KEY,
      },
      data: {
        text: chunk,
      },
      responseType: 'arraybuffer' as const, // To receive binary data in response
    };

    try {
      const apiResponse = await axios.request(apiRequestOptions);
      await fs.promises.writeFile(fileName, apiResponse.data);
    } catch (e) {
      console.log('Elevenlabs API Error', e);
      process.exit(1);
    }
  }
  return files;
}
