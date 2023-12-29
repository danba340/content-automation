import fs from 'fs';
import axios, { isAxiosError } from 'axios';
import { parseSync, stringifySync } from 'subtitle';

const BASE_URL = 'https://api.assemblyai.com/v2';

const HEADERS = {
  authorization: 'Bearer ' + process.env['ASSEMBLYAI_TOKEN'],
};

function colorLooper(colors: string[]) {
  let i = 0;
  return function () {
    if (!colors.length) return '';
    if (colors.length === 1) return colors[0];
    const color = colors[i];
    i = (i + 1) % colors.length;
    return color;
  };
}

export function hightlightSRT(path: string, colors: string[]) {
  const getColor = colorLooper(colors);
  const input = fs.readFileSync(path, 'utf8');
  const nodes = parseSync(input);
  const fixedNodes = nodes.map((node) => {
    if (node.type === 'cue') {
      // convert all cues to uppercase
      let done = false;
      const words = node.data.text.split(' ').map((word) => {
        if (word.toLowerCase() === 'javascript') {
          done = true;
          return `<font color="#f7df1e">${word}</font>`;
        }
        if (word.toLowerCase() === 'typescript') {
          done = true;
          return `<font color="#007acc">${word}</font>`;
        }
        if (word.toLowerCase() === 'python') {
          done = true;
          return `<font color="#58e235">${word}</font>`;
        }
        if (!done && word.length > 3) {
          done = true;
          return `<font color="${getColor()}">${word}</font>`;
        }
        return word;
      });
      node.data.text = words.join(' ');
    }

    return node;
  });
  const output = stringifySync(fixedNodes, { format: 'SRT' });
  fs.writeFileSync(path, String(output));
}

export function uppercaseSRT(path: string) {
  const input = fs.readFileSync(path, 'utf8');
  const nodes = parseSync(input);
  const fixedNodes = nodes.map((node) => {
    if (node.type === 'cue') {
      // convert all cues to uppercase
      node.data.text = node.data.text.toUpperCase();
    }

    return node;
  });
  const output = stringifySync(fixedNodes, { format: 'SRT' });
  fs.writeFileSync(path, String(output));
}

export function removeSRTChars(path: string, chars: string[]) {
  const input = fs.readFileSync(path, 'utf8');
  const nodes = parseSync(input);
  const fixedNodes = nodes.map((node) => {
    if (node.type === 'cue') {
      for (const char of chars) {
        while (node.data.text.includes(char)) {
          node.data.text = node.data.text.replace(char, '');
        }
      }
    }

    return node;
  });
  const output = stringifySync(fixedNodes, { format: 'SRT' });
  fs.writeFileSync(path, String(output));
}

/**
 *
 * @param {string} subtitles
 * @param {string} script
 */
export function fillLastScriptWordIsInSubtitles(subtitles: string, script: string) {
  let lastWordInScript = script.split(' ').at(-1);
  const nodes = parseSync(subtitles);
  const lastCue = nodes.reverse().find((n) => n.type === 'cue');
  // @ts-ignore
  const text = lastCue.data.text;
  const words = text.split(' ');
  const lastWordInSubtitles = words.at(-1);
  if (lastWordInScript !== lastWordInSubtitles) {
    // @ts-ignore
    lastCue.data.text = lastCue.data.text + '' + lastWordInScript;
    const output = stringifySync(nodes.reverse(), { format: 'SRT' });
    return output;
  }
  return subtitles;
}

async function upload_file(path: string) {
  console.log(`Uploading file: ${path}`);

  // Read the file data
  const data = await fs.readFileSync(path);
  let response;
  try {
    response = await axios.post(`${BASE_URL}/upload`, data, { headers: HEADERS });
  } catch (e) {
    console.log(e);
  }
  const upload_url = response?.data.upload_url;

  return upload_url;
}

async function getSubtitleFile(transcriptId: string, longestWord: number, fileFormat = 'srt') {
  if (!['srt', 'vtt'].includes(fileFormat)) {
    throw new Error(`Unsupported file format: ${fileFormat}. Please specify 'srt' or 'vtt'.`);
  }

  const url = `https://api.assemblyai.com/v2/transcript/${transcriptId}/${fileFormat}`;
  const params = {
    chars_per_caption: longestWord + 1,
  };
  try {
    const response = await axios.get(url, { headers: HEADERS, params });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(
        // @ts-ignore
        `Failed to retrieve ${fileFormat.toUpperCase()} file: ${
          error.response?.status
          // @ts-ignore
        } ${error.response?.data?.error}`,
      );
    } else {
      console.error('Error fetching subtitle file');
    }
  }
  return '';
}

export async function getTranscription(file: string, path: string) {
  // -----------------------------------------------------------------------------
  // Update the file path here, pointing to a local audio or video file.
  // If you don't have one, download a sample file: https://storage.googleapis.com/aai-web-samples/espn-bears.m4a
  // You may also remove the upload step and update the 'audio_url' parameter in the
  // 'transcribeAudio' function to point to a remote audio or video file.
  // -----------------------------------------------------------------------------
  const uploadUrl = await upload_file(file);
  // const uploadUrl = "https://cdn.assemblyai.com/upload/7bdec7d6-f38a-48c2-a2a1-ae884e4ff286"
  // const uploadUrl = 'https://cdn.assemblyai.com/upload/00eb8e22-432c-41da-9d6a-5a22a06b50b0'

  // If the upload fails, log an error and return
  if (!uploadUrl) {
    console.error(new Error('Upload failed. Please try again.'));
    return;
  }

  const data = {
    audio_url: uploadUrl,
  };
  const url = BASE_URL + '/transcript';
  let response;
  try {
    response = await axios.post(url, data, { headers: HEADERS });
  } catch (e) {
    console.log(e);
  }

  const transcriptId = response?.data.id;
  console.log('Transcription ID', transcriptId);
  // const transcriptId = '6zyfj8qq0d-0300-4dee-9304-b0dd120f55b8'
  if (!transcriptId) throw new Error('No transcript id');
  const pollingEndpoint = `https://api.assemblyai.com/v2/transcript/${transcriptId}`;

  let script;
  while (true) {
    console.log('Polling transcription...');
    let pollingResponse;
    try {
      pollingResponse = await axios.get(pollingEndpoint, {
        headers: HEADERS,
      });
    } catch (e) {
      console.log(e);
    }
    const transcriptionResult = pollingResponse?.data;

    if (transcriptionResult.status === 'completed') {
      script = transcriptionResult.text;
      console.log('Transcribed text', script);
      console.log('Transcription done. Fetching subtitle...');
      break;
    } else if (transcriptionResult.status === 'error') {
      throw new Error(`Transcription failed: ${transcriptionResult.error}`);
    } else {
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  // @ts-ignore
  const longestWord = Math.max(...script.split(' ').map((w) => w.length));

  let subtitle = await getSubtitleFile(transcriptId, longestWord);

  // last word of subtitle missing, TODO is it always the case
  subtitle = fillLastScriptWordIsInSubtitles(subtitle, script);

  // Print the completed transcript object
  console.log('Transcript done');

  await fs.promises.writeFile(path, String(subtitle));
  console.log('Wrote subtitle');

  return path;
}
