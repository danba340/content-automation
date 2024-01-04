import 'dotenv/config';

let env_keys = ['ELEVEN_LABS_API_KEY', 'ASSEMBLY_AI_API_KEY', 'REDDIT_PASSWORD', 'REDDIT_APP_SECRET', 'OPENAI_API_KEY'] as const;
type EnvKeys = (typeof env_keys)[number];

function parseEnv() {
  return env_keys.reduce((acc, env_key) => {
    const env_val = process.env[env_key];
    if (!env_val) {
      console.error('Misisng env var for:', env_key);
      process.exit(1);
    }
    return {
      ...acc,
      [env_key]: env_val,
    };
  }, {});
}

// @ts-ignore SAFE since it fails if any env is falsy
export const ENV: { [k in EnvKeys]: string } = parseEnv();

export const ELEVEN_LABS_VOICE_NAME = 'nicole'; // Nicole

export const REDDIT_CONFIG = {
  username: 'barely89',
  password: ENV.REDDIT_PASSWORD,
  appId: 'mXjzUAJha_BkrNmJkPCoJg',
  appSecret: ENV.REDDIT_APP_SECRET,
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:42.0) Gecko/20100101 Firefox/42.0',
};

export const SUBREDDIT = '/r/truestory/top/?t=all';
