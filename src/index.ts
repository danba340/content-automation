import { ENV } from './config.js';

async function main() {
  console.log('ENV', ENV);

  // Get reddit title and content
  const post = {
    id: 'demo',
    title: 'This is the test title',
    content: 'This is the test content meant to test the program (30M) (28F)',
  };
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
