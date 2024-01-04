import { ENV, SUBREDDIT } from './config.js';
import { Post, getUnfinishedDbPosts, saveRedditPostToDb } from './db.js';
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
  // while (true) {

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
    // continue;
  }

  // const post = {
  //   id: 'demo',
  //   title: 'This is the test title',
  //   content: 'This is the test content meant to test the program (30M) (28F)',
  // };
  // Exists in database? Blocked?

  // Create folder, set project path to src/projects/demo

  // Preprocess text
  const post_preprocessed = {
    id: 'demo',
    title: 'This is the test title',
    content: 'This is the test content meant to test the program, 30 year old male, 28 year old female',
  };

  const { id, title, content } = post_preprocessed;
  // Create voiceover
  const voiceOverPaths = await createVoiceover(title + '. ' + content, id);

  // Merge voiceovers
  const voiceOverPath = await mergeAudio(id, voiceOverPaths);
  // Update db

  // Transcribe
  const transcript = await getTranscription(voiceOverPath, `./projects/${id}/transcript.json`);
  // Update db

  // Remotion render childprocess npx remotion render <entry-file?> [<composition-id>] [<output-location>]
  // Stock video, RedditHtml shown when title read, Subtitles in bottom (Lemon days?, Animated?)
  // Update db

  // Thumbnail, Remotion
  // Update db

  // Title, shorten with LLM
  const yt_title = (await shortenForTitle(title)) || 'TODO';

  // Upload
  const videoFilePath = `./projects/${id}/finish.mp4`;
  const thumbnailPath = `./projects/${id}/thumb.png`;
  await uploadVideo(videoFilePath, thumbnailPath, yt_title, 'TODO', 'TAG,TODO');
  // Update db

  // Delete files

  await sleep(10);
  // }
}

main();
