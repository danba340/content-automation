import reddit_init from 'reddit';
import { REDDIT_CONFIG } from './config.js';
import { db } from './db.js';

const reddit = new reddit_init(REDDIT_CONFIG);

export type RedditPost = {
  data: {
    id: string;
    title: string;
    is_created_from_ads_ui: boolean;
    is_video: boolean;
  };
};

type SubredditResponse = {
  data: {
    children: RedditPost[];
  };
};

//urlSubReddit ex: '/r/ProgrammerHumor/new';
export async function dereddit(urlSubReddit: string): Promise<RedditPost[] | null> {
  const res: SubredditResponse = await reddit.get(urlSubReddit);
  if (!res.data) {
    console.error('Error fetching from subreddit');
    return null;
  }
  const posts = res.data.children.filter((c) => {
    if (db.data.posts[c.data.id]) {
      console.log('Already posted');
      return false;
    }
    if (!c.data.is_created_from_ads_ui) {
      console.log('Is Ad');
      return false;
    }
    if (c.data.is_video) {
      console.log('Is Video');
      return false;
    }
  });
  return posts;
}
