import { ENV, SUBREDDIT } from './config.js';
import { Post, getUnfinishedDbPosts } from './db.js';
import { dereddit } from './reddit.js';

async function main() {
  console.log('ENV', ENV);

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
    title: 'This is the test title',
    content: 'This is the test content meant to test the program, 30 year old male, 28 year old female',
  };

  // Create voiceover

  // Transcribe

  // Remotion render childprocess npx remotion render <entry-file?> [<composition-id>] [<output-location>]
  // Stock video, RedditHtml shown when title read, Subtitles in bottom (Lemon days?, Animated?)

  // Thumbnail, RedditHtml

  // Title, shorten with LLM

  // Upload
}

main();
