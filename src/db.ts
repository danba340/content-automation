import { JSONFilePreset } from 'lowdb/node';
import { RedditPost } from './reddit.js';

type PostBooleanKeys = 'blocked' | 'voiceover' | 'transcript' | 'thumbnail' | 'video' | 'uploaded' | 'update_thumbnail';

export type Post = {
  reddit: RedditPost;
  flags: { [k in PostBooleanKeys]: boolean };
  short_title: string;
  yt_video_id: string;
};

const DEFAULT_DATA: {
  posts: {
    [k: string]: Post;
  };
} = {
  posts: {
    demo: {
      short_title: '',
      yt_video_id: '',
      reddit: {
        data: {
          id: 'demo-id',
          title: 'Demo title',
          is_created_from_ads_ui: false,
          is_video: false,
          selftext: 'Demo selftext',
          over_18: false,
        },
      },
      flags: {
        blocked: false,
        voiceover: false,
        transcript: false,
        thumbnail: false,
        video: false,
        uploaded: false,
        update_thumbnail: false,
      },
    },
  },
};

export const db = await JSONFilePreset<typeof DEFAULT_DATA>('db.json', { posts: {} }); //DEFAULT_DATA);

export async function getUnfinishedDbPosts(): Promise<Post[]> {
  await db.read();
  const posts = Object.entries(db.data.posts);
  const someNeedThumbnail = posts.filter(([id, post]) => {
    return post.flags.update_thumbnail && post.flags.uploaded;
  });
  if (someNeedThumbnail.length) {
    return someNeedThumbnail.map((post) => ({
      id: post[0],
      ...post[1],
    }));
  }
  const unfinishedPosts = posts.filter(([id, post]) => {
    return !post.flags.blocked && !post.flags.uploaded;
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
    short_title: '',
    yt_video_id: '',
    flags: {
      blocked: false,
      voiceover: false,
      transcript: false,
      thumbnail: false,
      video: false,
      uploaded: false,
      update_thumbnail: false,
    },
  };

  await db.update(({ posts }) => {
    posts[redditPost.data.id] = newPost;
  });
}

export async function updatePostFlagInDb(id: string, key: PostBooleanKeys, val: boolean) {
  await db.update(({ posts }) => {
    posts[id].flags[key] = val;
  });
}

export async function updatePostShortTitleInDb(id: string, val: string) {
  await db.update(({ posts }) => {
    posts[id].short_title = val;
  });
}

export async function updatePostYTVideoIdInDb(id: string, val: string) {
  await db.update(({ posts }) => {
    posts[id].yt_video_id = val;
  });
}

export async function updatePostUpdateThumbnailInDb(id: string, val: boolean) {
  await db.update(({ posts }) => {
    posts[id].flags.update_thumbnail = val;
  });
}
