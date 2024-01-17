import fs from 'fs';
import { ENV, REDDIT_LINK } from './config.js';
import { Post, getUnfinishedDbPosts, saveRedditPostToDb, updatePostFlagInDb, updatePostShortTitleInDb, updatePostUpdateThumbnailInDb } from './db.js';
import { shortenForTitle } from './llm.js';
import { dereddit } from './reddit.js';
import { getTranscription } from './transcribe.js';
import { changeThumbnail, uploadVideo } from './upload.js';
import { createVoiceover, mergeAudio } from './voiceover.js';
import { renderThumb, renderVideo } from './render.js';
import { preprocessTextReading } from './text.js';
import { mp3Seconds, sleep, yesOrNo } from './utils.js';

async function main() {
  // console.log('ENV', ENV);
  while (true) {
    console.log('Starting over');
    let post: Post | null = null;
    const dbPosts = await getUnfinishedDbPosts();
    if (dbPosts.length) {
      post = dbPosts[0];
      console.log('Processig DB post with title:', post.reddit.data.title);
    }

    // Get new reddit posts and reloop
    if (!post) {
      const redditPosts = await dereddit(REDDIT_LINK);
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
    let folderExists = false;
    // Create folder
    try {
      folderExists = (await fs.promises.lstat(`${cwd}/projects/${id}`)).isDirectory();
    } catch (e) {}
    if (!folderExists) {
      await fs.promises.mkdir(`${cwd}/projects/${id}`);
    }
    const voiceOverPath = `${cwd}/projects/${id}/voiceover.mp3`;
    const introVoiceOverPath = `${cwd}/projects/${id}/voiceover-1.mp3`;
    const transcriptPath = `${cwd}/projects/${id}/transcript.json`;
    const videoFilePath = `${cwd}/projects/${id}/finish.mp4`;
    const thumbnailPath = `${cwd}/projects/${id}/thumb.png`;
    const titleReading = preprocessTextReading(title);

    // Title, shorten with LLM
    // if (title.length <= 100) {
    // await updatePostShortTitleInDb(id, title);
    // } else if (!post.short_title) {
    //   console.log('-- TITLE SHORTENING --');
    //   console.log('Title with length', title.length, 'need shortening');
    //   const yt_title = await shortenForTitle(title);
    //   console.log('Shortened title:', yt_title);
    //   if (!yt_title) {
    //     console.log('Failed to generate shorter title');
    //     process.exit(1);
    //   }
    //   await updatePostShortTitleInDb(id, yt_title);
    // }

    if (!post.flags.voiceover) {
      // Create voiceover
      console.log('-- CREATING VOICEOVER --');
      const end = ' Thanks for listening. Like and Subscribe for more.';
      const fullText = `${title} ${content} ${end}`;
      const cost = (fullText.length / 1000) * 0.3;
      console.log('Content: ', content);
      console.log('Title: ', title);
      console.log('Length: ', fullText.length, 'Video Cost: ' + cost.toFixed(2) + '$');
      const shouldMakeVideo = await yesOrNo('Continue?');
      if (!shouldMakeVideo) {
        await updatePostFlagInDb(id, 'blocked', true);
        continue;
      }
      const voiceOverPaths = await createVoiceover(title, content + end, id);
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
      const durationS = await mp3Seconds(voiceOverPath);
      const introDurationS = await mp3Seconds(introVoiceOverPath);
      const transcriptRaw = (await fs.promises.readFile(transcriptPath)).toString();
      const transcript = JSON.parse(transcriptRaw);
      await fs.promises.rm(`${cwd}/remotion/public/voiceover.mp3`);
      await fs.promises.cp(voiceOverPath, `${cwd}/remotion/public/voiceover.mp3`);
      try {
        await renderVideo(videoFilePath, durationS, introDurationS, titleReading, transcript);
        // Update db
        await updatePostFlagInDb(id, 'video', true);
      } catch (e) {
        console.log('Failed to render thumb', e);
        process.exit(1);
      }
    }

    if (!post.flags.thumbnail || post.flags.update_thumbnail) {
      try {
        await renderThumb(thumbnailPath, titleReading);
        // Update db
        await updatePostFlagInDb(id, 'thumbnail', true);
      } catch (e) {
        console.log('Failed to render thumb', e);
        process.exit(1);
      }
    }

    if (!post.flags.uploaded) {
      try {
        // Upload
        console.log('Starting upload');
        await uploadVideo(
          id,
          videoFilePath,
          thumbnailPath,
          titleReading,
          'Hope you enjoyed this true story from the interwebs. Uploading daily. Subscribe for more 🔥',
          'reddit,stories,storytelling,asmr,askreddit',
        );
        // Update db
        await updatePostFlagInDb(id, 'uploaded', true);
        // Delete files
        // TODO
      } catch (e) {
        console.log('Upload video or thumbnail error', e);
        process.exit(1);
      }
    }

    if (post.flags.update_thumbnail) {
      try {
        // Upload
        console.log('Starting upload');
        await changeThumbnail(post.yt_video_id, thumbnailPath);
        // Update db
        await updatePostUpdateThumbnailInDb(id, false);
        console.log('Upload thumbnail success');
        // Delete files
        // TODO
      } catch (e) {
        console.log('Upload thumbnail error', e);
        process.exit(1);
      }
    }

    console.log('Done.', post.yt_video_id, post.short_title);
    // await sleep(10);
  }
}

main();
