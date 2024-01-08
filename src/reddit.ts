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
    selftext: string;
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
      console.log('Already exists in DB');
      return false;
    }
    // if (!c.data.is_created_from_ads_ui) {
    //   console.log('Is Ad');
    // }
    //   return false;
    if (c.data.is_video) {
      console.log('Is Video');
      return false;
    }
    return true;
    // TODO check for CONTENT WARNING
  });
  return posts;
}

// Example response res.data.children[0]
// '{"kind":"t3","data":{"approved_at_utc":null,"subreddit":"truestory","selftext":"I was living with my dad and brother at the time, I believe I was 11-12 years old, when I was living with my dad my brother and I felt uncomfortable with him and his life choices, so when our dad would be under the influence of alc or d*ugs we went on walks around the neighborhood, our neighborhood had very sketchy people so taking walks would be a bit scary for the two of us.\n\nOne night I felt a bit uncomfortable around my dad so I took my husky/wolf breed 5 F out for a walk, it was around 12 at night so taking my dog along with me seemed the most ideal thing to do while my brother chose to stay home, I decided to take a walk in apart of the neighborhood I wasn’t to familiar with since I’ve only walked to it once, my dog and I were having a fun time exploring this part of the the neighborhood and when I decided to head back home I noticed this man around his 30s watch me, he hadn’t noticed my dog since she was on the side of me where there was bushes, the man watched me as he opened his trailer on the other side of the street then got a bit closer to me and then he noticed my dog and walked the other way and shut his trailer door and drove off, my dog and I ran far enough away from the spot the man had driven away, then I realized my dog saved my life. my dog is the type where if there was a burglar she would hold the flashlight for him, but the man didn’t think twice trying to mess with her.\n\nI’ve recently moved out of my dads house to permanently to live with my mom, I haven’t seen my husky since and it makes me sad that my pride and joy living there will never see me again, I miss her so and I only wish the best for that dog.","author_fullname":"t2_rbut7omu","saved":false,"mod_reason_title":null,"gilded":0,"clicked":false,"title":"My husky saved my life","link_flair_richtext":[],"subreddit_name_prefixed":"r/truestory","hidden":false,"pwls":null,"link_flair_css_class":null,"downs":0,"thumbnail_height":null,"top_awarded_type":null,"hide_score":false,"name":"t3_wmf5g7","quarantine":false,"link_flair_text_color":"dark","upvote_ratio":0.94,"author_flair_background_color":null,"subreddit_type":"restricted","ups":13,"total_awards_received":0,"media_embed":{},"thumbnail_width":null,"author_flair_template_id":null,"is_original_content":false,"user_reports":[],"secure_media":null,"is_reddit_media_domain":false,"is_meta":false,"category":null,"secure_media_embed":{},"link_flair_text":null,"can_mod_post":false,"score":13,"approved_by":null,"is_created_from_ads_ui":false,"author_premium":false,"thumbnail":"self","edited":false,"author_flair_css_class":null,"author_flair_richtext":[],"gildings":{},"content_categories":null,"is_self":true,"mod_note":null,"created":1660289774,"link_flair_type":"text","wls":null,"removed_by_category":null,"banned_by":null,"author_flair_type":"text","domain":"self.truestory","allow_live_comments":false,"selftext_html":"&lt;!-- SC_OFF --&gt;&lt;div class="md"&gt;&lt;p&gt;I was living with my dad and brother at the time, I believe I was 11-12 years old, when I was living with my dad my brother and I felt uncomfortable with him and his life choices, so when our dad would be under the influence of alc or d*ugs we went on walks around the neighborhood, our neighborhood had very sketchy people so taking walks would be a bit scary for the two of us.&lt;/p&gt;\n\n&lt;p&gt;One night I felt a bit uncomfortable around my dad so I took my husky/wolf breed 5 F out for a walk, it was around 12 at night so taking my dog along with me seemed the most ideal thing to do while my brother chose to stay home, I decided to take a walk in apart of the neighborhood I wasn’t to familiar with since I’ve only walked to it once, my dog and I were having a fun time exploring this part of the the neighborhood and when I decided to head back home I noticed this man around his 30s watch me, he hadn’t noticed my dog since she was on the side of me where there was bushes, the man watched me as he opened his trailer on the other side of the street then got a bit closer to me and then he noticed my dog and walked the other way and shut his trailer door and drove off, my dog and I ran far enough away from the spot the man had driven away, then I realized my dog saved my life. my dog is the type where if there was a burglar she would hold the flashlight for him, but the man didn’t think twice trying to mess with her.&lt;/p&gt;\n\n&lt;p&gt;I’ve recently moved out of my dads house to permanently to live with my mom, I haven’t seen my husky since and it makes me sad that my pride and joy living there will never see me again, I miss her so and I only wish the best for that dog.&lt;/p&gt;\n&lt;/div&gt;&lt;!-- SC_ON --&gt;","likes":null,"suggested_sort":null,"banned_at_utc":null,"view_count":null,"archived":false,"no_follow":false,"is_crosspostable":true,"pinned":false,"over_18":false,"all_awardings":[],"awarders":[],"media_only":false,"can_gild":false,"spoiler":false,"locked":false,"author_flair_text":null,"treatment_tags":[],"visited":false,"removed_by":null,"num_reports":null,"distinguished":null,"subreddit_id":"t5_2qxku","author_is_blocked":false,"mod_reason_by":null,"removal_reason":null,"link_flair_background_color":"","id":"wmf5g7","is_robot_indexable":true,"report_reasons":null,"author":"livAloo0821","discussion_type":null,"num_comments":0,"send_replies":true,"whitelist_status":null,"contest_mode":false,"mod_reports":[],"author_patreon_flair":false,"author_flair_text_color":null,"permalink":"/r/truestory/comments/wmf5g7/my_husky_saved_my_life/","parent_whitelist_status":null,"stickied":false,"url":"https://www.reddit.com/r/truestory/comments/wmf5g7/my_husky_saved_my_life/","subreddit_subscribers":594,"created_utc":1660289774,"num_crossposts":0,"media":null,"is_video":false}}';
