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

export async function renderVideo(outPath: string, durationS: number, introDurationS: number, title: string, transcript: WordType[]) {
  const OUTRO_FRAMES = 10 * 30;
  let durationInFramesInput = msToFrame(durationS * 1000) + OUTRO_FRAMES;
  let introDurationInFrames = msToFrame(introDurationS * 1000);
  let props = {
    durationInFramesInput,
    introDurationInFrames,
    title,
    transcript,
  };
  return new Promise<void>((resolve, reject) => {
    const remotionPath = `${process.cwd()}/remotion`;
    const child = spawn('npx', ['remotion', 'render', 'Video', outPath, '--concurrency', '1', '--props', JSON.stringify(props)], { cwd: remotionPath });
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
    child.on('exit', (code) => {
      if (code !== 0) {
        reject();
        return;
      }
      resolve();
    });
  });
}

export async function renderThumb(outPath: string, text: string) {
  let props = {
    text,
  };
  const remotionPath = `${process.cwd()}/remotion`;
  return new Promise<void>((resolve, reject) => {
    const child = spawn('npx', ['remotion', 'still', 'Thumbnail', outPath, '--props', JSON.stringify(props)], { cwd: remotionPath });
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
    child.on('exit', (code) => {
      if (code !== 0) {
        reject();
        return;
      }
      resolve();
    });
  });
}
