import { JSONFilePreset } from 'lowdb/node';
import { RedditPost } from './reddit.js';

export type Post = {
  reddit: RedditPost;
  blocked: boolean;
  voiceover: boolean;
  transcript: boolean;
  thumbnail: boolean;
  video: boolean;
  uploaded: boolean;
};

const DEFAULT_DATA: {
  posts: {
    [k: string]: Post;
  };
} = {
  posts: {
    demo: {
      reddit: {
        data: {
          id: 'demo-id',
          title: 'Demo title',
          is_created_from_ads_ui: false,
          is_video: false,
        },
      },
      blocked: false,
      voiceover: false,
      transcript: false,
      thumbnail: false,
      video: false,
      uploaded: false,
    },
  },
};

export const db = await JSONFilePreset<typeof DEFAULT_DATA>('db.json', DEFAULT_DATA);

export async function getUnfinishedDbPosts(): Promise<Post[]> {
  await db.read();
  const posts = Object.entries(db.data.posts);
  const unfinishedPosts = posts.filter(([id, post]) => {
    return !post.blocked && !post.uploaded;
  });
  return unfinishedPosts.map((post) => ({
    id: post[0],
    ...post[1],
  }));
}

export async function saveRedditPostToDb(redditPost: RedditPost) {
  await db.read();

  // Already exists?
  if (db.data.posts[redditPost.data.id]) return;

  const newPost = {
    reddit: redditPost,
    blocked: false,
    voiceover: false,
    transcript: false,
    thumbnail: false,
    video: false,
    uploaded: false,
  };

  await db.update(({ posts }) => {
    posts[redditPost.data.id] = newPost;
  });
}
