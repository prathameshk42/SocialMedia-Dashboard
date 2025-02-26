export interface IPublicMetrics {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
    bookmark_count: number;
    impression_count: number;
}

export interface INonPublicMetrics {
    impression_count: number;
    engagements: number;
    user_profile_clicks: number;
}

export interface ITweet {
    text: string;
    created_at: string;
    id: string;
    edit_history_tweet_ids: string[];
    public_metrics: IPublicMetrics;
    non_public_metrics: INonPublicMetrics;
}

export interface IPublicProfile {
    followers_count: number;
    following_count: number;
    tweet_count: number;
    listed_count: number;
    like_count: number;
}

export interface IProfile {
    username: string;
    name: string;
    id: string;
    public_metrics: IPublicProfile;
}

export interface ITweets {
    tweets: ITweet[];
    fetchedAt: string;
    profile: IProfile | null;
}

export interface ITweetProps {
    tweets: ITweet[];
    profile: IProfile;
}
