// @ts-ignore
import MP3Duration from 'mp3-duration';
import readline from 'readline';

export async function sleep(s: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, s * 1000);
  });
}

export async function mp3Seconds(path: string): Promise<number> {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    MP3Duration(path, function (err, duration) {
      if (err) reject();
      resolve(duration);
    });
  });
}

export function yesOrNo(query: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query + ' Y/n\n', (ans) => {
      rl.close();
      if (ans === 'Y') {
        resolve(true);
      }
      resolve(false);
    }),
  );
}
