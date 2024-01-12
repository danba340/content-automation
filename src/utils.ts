// @ts-ignore
import MP3Duration from 'mp3-duration';

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
