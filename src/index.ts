import fs from 'fs';
// @ts-ignore
import getMP3Duration from 'get-mp3-duration';
import { ENV, SUBREDDIT } from './config.js';
import { Post, getUnfinishedDbPosts, saveRedditPostToDb, updatePostFlagInDb } from './db.js';
import { shortenForTitle } from './llm.js';
import { dereddit } from './reddit.js';
import { getTranscription } from './transcribe.js';
import { uploadVideo } from './upload.js';
import { createVoiceover, mergeAudio } from './voiceover.js';

async function sleep(s: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, s * 1000);
  });
}

async function main() {
  console.log('ENV', ENV);
  while (true) {
    let post: Post | null = null;
    const dbPosts = await getUnfinishedDbPosts();
    if (dbPosts.length) {
      post = dbPosts[0];
    }
    // Get reddit title and content
    if (!post) {
      const redditPosts = await dereddit(SUBREDDIT);
      if (!redditPosts) {
        console.error('No reddit posts');
        process.exit(1);
      }
      for (const redditPost of redditPosts) {
        // Save to db
        // Block first one when debugging
        // Second one is about husky
        await saveRedditPostToDb(redditPost);
      }
      continue;
    }

    // const post = {
    //   id: 'demo',
    //   title: 'This is the test title',
    //   content: 'This is the test content meant to test the program (30M) (28F)',
    // };
    // Exists in database? Blocked?

    const { id, title, selftext: content } = post.reddit.data;

    // Create folder, set project path to src/projects/demo
    await fs.promises.mkdir(`./projects/${id}`);

    // Preprocess text
    // const post_preprocessed = {
    //   id: 'demo',
    //   title: 'This is the test title',
    //   content: 'This is the test content meant to test the program, 30 year old male, 28 year old female',
    // };
    const voiceOverPath = `./projects/${id}/voiceover.mp3`;
    const transcriptPath = `./projects/${id}/transcript.json`;
    const videoFilePath = `./projects/${id}/finish.mp4`;
    const thumbnailPath = `./projects/${id}/thumb.png`;

    // Title, shorten with LLM

    if (!post.short_title) {
      const yt_title = (await shortenForTitle(title)) || 'TODO';
      await updatePostFlagInDb(id, 'voiceover', true);
    }

    if (!post.flags.voiceover) {
      // Create voiceover
      const voiceOverPaths = await createVoiceover(title + '. ' + content, id);
      // Merge voiceovers
      await mergeAudio(id, voiceOverPaths);
      // Update db
      await updatePostFlagInDb(id, 'voiceover', true);
    }

    if (!post.flags.transcript) {
      // Transcribe
      await getTranscription(voiceOverPath, transcriptPath);
      // Update db
      await updatePostFlagInDb(id, 'transcript', true);
    }

    if (!post.flags.video) {
      const duration = getMP3Duration(voiceOverPath);
      // Remotion render childprocess npx remotion render <entry-file?> [<composition-id>] [<output-location>]
      // Stock video, RedditHtml shown when title read, Subtitles in bottom (Lemon days?, Animated?)
      // TODO
      // Update db
      await updatePostFlagInDb(id, 'video', true);
    }

    if (!post.flags.thumbnail) {
      // Remotion render childprocess npx remotion render <entry-file?> [<composition-id>] [<output-location>]
      // TODO
      // Update db
      await updatePostFlagInDb(id, 'thumbnail', true);
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
