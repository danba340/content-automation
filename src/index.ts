import fs from 'fs';
// @ts-ignore
import getMP3Duration from 'get-mp3-duration';
// @ts-ignore
import MP3Duration from 'mp3-duration';
import { ENV, SUBREDDIT } from './config.js';
import { Post, getUnfinishedDbPosts, saveRedditPostToDb, updatePostFlagInDb, updatePostShortTitleInDb } from './db.js';
import { shortenForTitle } from './llm.js';
import { dereddit } from './reddit.js';
import { getTranscription } from './transcribe.js';
import { uploadVideo } from './upload.js';
import { createVoiceover, mergeAudio } from './voiceover.js';
import { renderThumb, renderVideo } from './render.js';

export async function sleep(s: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, s * 1000);
  });
}

async function mp3Seconds(path: string): Promise<number> {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    MP3Duration(path, function (err, duration) {
      if (err) reject();
      resolve(duration);
    });
  });
}

async function main() {
  console.log('ENV', ENV);
  while (true) {
    let post: Post | null = null;
    const dbPosts = await getUnfinishedDbPosts();
    if (dbPosts.length) {
      post = dbPosts[0];
      console.log('Processig DB post with title:', post.reddit.data.title);
    }

    // Get new reddit posts and reloop
    if (!post) {
      const redditPosts = await dereddit(SUBREDDIT);
      if (!redditPosts) {
        console.error('No reddit posts');
        process.exit(1);
      }
      console.error('Saving', redditPosts.length, 'reddit posts');
      for (const redditPost of redditPosts) {
        await saveRedditPostToDb(redditPost);
      }
      continue;
    }

    const { id, title, selftext: content } = post.reddit.data;

    const cwd = process.cwd();
    // Create folder
    const folderExists = (await fs.promises.lstat(`${cwd}/projects/${id}`)).isDirectory();
    if (!folderExists) {
      await fs.promises.mkdir(`${cwd}/projects/${id}`);
    }
    const voiceOverPath = `${cwd}/projects/${id}/voiceover.mp3`;
    const introVoiceOverPath = `${cwd}/projects/${id}/voiceover-1.mp3`;
    const transcriptPath = `${cwd}/projects/${id}/transcript.json`;
    const videoFilePath = `${cwd}/projects/${id}/finish.mp4`;
    const thumbnailPath = `${cwd}/projects/${id}/thumb.png`;

    // Title, shorten with LLM
    if (post.reddit.data.title.length <= 100) {
      await updatePostShortTitleInDb(id, post.reddit.data.title);
    } else if (!post.short_title) {
      console.log('-- TITLE SHORTENING --');
      console.log('Title with length', title.length, 'need shortening');
      const yt_title = await shortenForTitle(title);
      console.log('Shortened title:', yt_title);
      if (!yt_title) {
        console.log('Failed to generate shorter title');
        process.exit(1);
      }
      await updatePostShortTitleInDb(id, yt_title);
    }

    if (!post.flags.voiceover) {
      // Create voiceover
      console.log('-- CREATING VOICEOVER --');
      const voiceOverPaths = await createVoiceover(title, content, id);
      // Merge voiceovers
      if (voiceOverPaths.length <= 1) {
        console.log('Only one voiceover, should always be at least 2');
        process.exit(1);
      }
      console.log('Merging', voiceOverPaths.length, 'voiceover files');
      await mergeAudio(id, voiceOverPaths);
      // Update db
      await updatePostFlagInDb(id, 'voiceover', true);
    }

    if (!post.flags.transcript) {
      // Transcribe
      const success = await getTranscription(voiceOverPath, transcriptPath);
      if (!success) {
        console.log('Transcript failed');
        process.exit(1);
      }
      // Update db
      await updatePostFlagInDb(id, 'transcript', true);
    }

    if (!post.flags.video) {
      const duration = await mp3Seconds(voiceOverPath);
      const introDuration = await mp3Seconds(introVoiceOverPath);
      const transcriptRaw = (await fs.promises.readFile(transcriptPath)).toString();
      const transcript = JSON.parse(transcriptRaw);
      try {
        await renderVideo(videoFilePath, duration, introDuration, post.short_title, transcript); // TODO add intro duration
        // Update db
        await updatePostFlagInDb(id, 'video', true);
      } catch (e) {
        console.log('Failed to render thumb', e);
        process.exit(1);
      }
    }

    if (!post.flags.thumbnail) {
      try {
        await renderThumb(thumbnailPath);
        // Update db
        await updatePostFlagInDb(id, 'thumbnail', true);
      } catch (e) {
        console.log('Failed to render thumb', e);
        process.exit(1);
      }
    }

    if (!post.flags.uploaded && post.flags.shouldUpload) {
      try {
        // Upload
        await uploadVideo(videoFilePath, thumbnailPath, post.short_title, 'TODO', 'TAG,TODO');
        // Update db
        await updatePostFlagInDb(id, 'uploaded', true);
        // Delete files
        // TODO
      } catch (e) {
        console.log('Upload error', e);
      }
    }

    await sleep(10);
  }
}

main();
