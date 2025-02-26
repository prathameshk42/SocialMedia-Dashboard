export interface IFbPost {
    fbPostId: string;
    created_time: string;
    comments: number;
    reactions: number;
    attachments: string;
    message: string;
    shares: number;
}

export interface IFbProfile {
    id: string;
    name: string;
    picture: string;
    friends: number;
    birthday: string;
    posts: IFbPost[];
}
