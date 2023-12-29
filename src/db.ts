import { JSONFilePreset } from 'lowdb/node';

type Post = {
  reddit?: {
    id: string;
  };
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
        id: 'demo-id',
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
