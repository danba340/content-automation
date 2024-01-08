import { spawn } from 'child_process';

export function msToFrame(ms: number) {
  const FPS = 30;
  const s = ms / 1000;
  return FPS * s;
}

type WordType = {
  start: number;
  end: number;
  text: string;
};

export async function renderVideo(outPath: string, duration: number, title: string, transcript: WordType[]) {
  let durationInFrames = msToFrame(duration);
  let props = {
    durationInFrames,
    title,
    transcript,
  };
  return new Promise((resolve, reject) => {
    const child = spawn('npx', ['remotion', 'render', 'src/index.tsx', 'video-comp-id', outPath, '--props', JSON.stringify(props)]);
    // Log output
    child.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    // Error
    child.stdout.on('error', (err) => {
      console.log(err);
      reject();
    });

    // Wait for the child process to exit
    child.on('exit', resolve);
  });
}

export async function renderThumb(outPath: string) {
  return new Promise((resolve, reject) => {
    const child = spawn('npx', ['remotion', 'render', 'src/index.tsx', 'thumbnail-comp-id', outPath]);
    // Log output
    child.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    // Error
    child.stdout.on('error', (err) => {
      console.log(err);
      reject();
    });

    // Wait for the child process to exit
    child.on('exit', resolve);
  });
}
