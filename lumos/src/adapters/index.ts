import { collection, query, where, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import { db } from './provider';
import { IMessage } from '../redux/ChatSlice/types';
import axios from 'axios';
import { ITaskStatus } from '../hooks/useTodo';
import { IFbPost, IFbProfile } from '../redux/FbSlice/types';

export const URL = 'https://us-central1-social-sync-c8bd0.cloudfunctions.net/';

export const fetchUserDetails = async (email: string) => {
    const q = query(collection(db, 'users'), where('email', '==', email));

    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length) return { ...querySnapshot.docs[0]?.data(), userId: querySnapshot.docs[0]?.id };
};

export const createUser = async (name: string, age: string, gender: string, email: string) => {
    const userExists = await fetchUserDetails(email);
    if (userExists) throw Error('User Already Exists');
    else {
        const userRef = doc(db, 'users', nanoid());
        await setDoc(userRef, { name, age, gender, email });
        return 'Success';
    }
};

export const sendMessage = async (messages: IMessage[]) => {
    const response = await axios.post(URL + 'chatMessage', { messages });
    return response.data;
};

export const createTask = async (userId: string, title: string, description: string, status: ITaskStatus) => {
    const userTasksRef = collection(db, `users/${userId}/tasks`);
    const querySnapshot = await getDocs(userTasksRef);
    const newTaskRef = doc(userTasksRef);
    await setDoc(newTaskRef, { title, description, status, id: `SS-${querySnapshot.size + 1}` });
    return {
        message: 'Success',
        data: { title, description, status, id: `SS-${querySnapshot.size + 1}`, taskId: newTaskRef.id }
    };
};

export const fetchTasks = async (userId: string) => {
    const todoTasks: any = [];
    const inprogressTasks: any = [];
    const doneTasks: any = [];
    const tasksRef = collection(db, `users/${userId}/tasks`);
    const querySnapshot = await getDocs(tasksRef);
    querySnapshot.docs.map((doc) => {
        const data = { ...doc.data() };
        if (data.status === 'todo') todoTasks.push({ ...data, taskId: doc.id });
        else if (data.status === 'inprogress') inprogressTasks.push({ ...data, taskId: doc.id });
        else if (data.status === 'done') doneTasks.push({ ...data, taskId: doc.id });
    });
    return { todo: todoTasks, inprogress: inprogressTasks, done: doneTasks };
};

export const updateTaskStatus = async (userId: string, taskId: string, status: ITaskStatus) => {
    try {
        const taskRef = doc(db, `users/${userId}/tasks/${taskId}`);
        await updateDoc(taskRef, {
            status: status
        });
        return 'Success';
    } catch (error) {
        console.log('updateTaskStatus error-->>', error);
    }
};

export const updateTask = async (
    userId: string,
    taskId: string,
    title: string,
    description: string,
    status: ITaskStatus
) => {
    try {
        const taskRef = doc(db, `users/${userId}/tasks/${taskId}`);
        await updateDoc(taskRef, {
            status,
            title,
            description
        });
        return 'Success';
    } catch (error) {
        console.log('updateTaskStatus error-->>', error);
    }
};

export const fetchTwitterRequestToken = async () => {
    const response = await axios.post(URL + 'getTwitterRequestToken');
    return response.data;
};

export const fetchTwitterAccessToken = async (oauthToken: string, oauthVerifier: string) => {
    const response = await axios.post(URL + 'getTwitterAccessToken', null, {
        params: {
            oauth_token: oauthToken,
            oauth_verifier: oauthVerifier
        }
    });
    return response.data;
};

export const updateTwitterCreds = async (
    userId: string,
    accessToken: string,
    accessTokenSecret: string,
    userName: string,
    name: string,
    id: string
) => {
    try {
        const taskRef = doc(db, `users/${userId}`);
        await updateDoc(taskRef, {
            twitterAccessToken: accessToken,
            twitterAccessTokenSecret: accessTokenSecret,
            twitterUserName: userName,
            twitterName: name,
            twitterId: id
        });
        return 'Success';
    } catch (error) {
        console.log('updateTwitterCreds error-->>', error);
    }
};

export const fetchTwitterUser = async (accessToken: string, accessTokenSecret: string) => {
    const response = await axios.post(URL + 'fetchTwitterUser', {
        accessToken,
        accessTokenSecret
    });
    return response.data;
};

export const fetchTweets = async (accessToken: string, accessTokenSecret: string, userId: string) => {
    const response = await axios.post(URL + 'fetchTweets', {
        accessToken,
        accessTokenSecret,
        userId
    });
    // const response = [
    //     {
    //         public_metrics: {
    //             retweet_count: 0,
    //             reply_count: 0,
    //             like_count: 1,
    //             quote_count: 0,
    //             bookmark_count: 0,
    //             impression_count: 4
    //         },
    //         id: '1860253320985681989',
    //         non_public_metrics: {
    //             impression_count: 4,
    //             engagements: 1,
    //             user_profile_clicks: 0
    //         },
    //         text: 'Testing part 1',
    //         created_at: '2024-11-23T09:25:28.000Z',
    //         edit_history_tweet_ids: ['1860253320985681989']
    //     },
    //     {
    //         public_metrics: {
    //             retweet_count: 0,
    //             reply_count: 0,
    //             like_count: 1,
    //             quote_count: 0,
    //             bookmark_count: 0,
    //             impression_count: 4
    //         },
    //         id: '1860253320985681978',
    //         non_public_metrics: {
    //             impression_count: 4,
    //             engagements: 1,
    //             user_profile_clicks: 0
    //         },
    //         text: 'Testing part 2',
    //         created_at: '2024-11-23T09:25:28.000Z',
    //         edit_history_tweet_ids: ['1860253320985681989']
    //     },
    //     {
    //         public_metrics: {
    //             retweet_count: 0,
    //             reply_count: 0,
    //             like_count: 1,
    //             quote_count: 0,
    //             bookmark_count: 0,
    //             impression_count: 4
    //         },
    //         id: '18602533209856814569',
    //         non_public_metrics: {
    //             impression_count: 4,
    //             engagements: 1,
    //             user_profile_clicks: 0
    //         },
    //         text: 'Testing part 3',
    //         created_at: '2024-11-23T09:25:28.000Z',
    //         edit_history_tweet_ids: ['1860253320985681989']
    //     }
    // ];
    return response.data;
};

export const fetchTwitterProfile = async (accessToken: string, accessTokenSecret: string) => {
    const response = await axios.post(URL + 'fetchTwitterProfile', {
        accessToken,
        accessTokenSecret
    });
    // const response = {
    //     username: 'TestProjec1130',
    //     name: 'Test Project',
    //     id: '1852244834649550848',
    //     public_metrics: {
    //         followers_count: 1,
    //         following_count: 1,
    //         tweet_count: 1,
    //         listed_count: 0,
    //         like_count: 1
    //     }
    // };
    return response.data;
};

export const createTwitterPost = async (accessToken: string, accessTokenSecret: string, content: string) => {
    const response = await axios.post(URL + 'createTwitterPost', {
        accessToken,
        accessTokenSecret,
        content
    });
    return response.data;
};

export const deleteTwitterPost = async (accessToken: string, accessTokenSecret: string, tweetId: string) => {
    const response = await axios.post(URL + 'deleteTwitterPost', {
        accessToken,
        accessTokenSecret,
        tweetId
    });
    return response.data;
};

export const deleteTask = async (userId: string, taskId: string) => {
    try {
        const taskRef = doc(db, `users/${userId}/tasks/${taskId}`);
        await deleteDoc(taskRef);
        return 'Success';
    } catch (error) {
        console.log('deleteTask error-->>', error);
    }
};

export const fetchInstaAccessToken = async (code: string) => {
    const response = await axios.post(URL + 'getInstaAccessToken', { code });
    return response.data;
};

export const updateInstaToken = async (userId: string, accessToken: string) => {
    try {
        const taskRef = doc(db, `users/${userId}`);
        await updateDoc(taskRef, { instaAccessToken: accessToken });
        return 'Success';
    } catch (error) {
        console.log('updateInstaToken error-->>', error);
    }
};

export const updateFbToken = async (userId: string, accessToken: string) => {
    try {
        const taskRef = doc(db, `users/${userId}`);
        await updateDoc(taskRef, { fbAccessToken: accessToken });
        return 'Success';
    } catch (error) {
        console.log('updateInstaToken error-->>', error);
    }
};

export const fetchFbProfile = async (token: string) => {
    const response = await axios.post(URL + 'facebookProfile', { accessToken: token });
    // const response: any = {
    //     data: {
    //         id: '122109620762611824',
    //         name: 'Zinu Jain',
    //         picture: {
    //             data: {
    //                 height: 50,
    //                 is_silhouette: false,
    //                 url: 'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=122109620762611824&height=50&width=50&ext=1735042944&hash=AbaWZSpFg5lr8hHeIYgBG-da',
    //                 width: 50
    //             }
    //         },
    //         friends: {
    //             data: [],
    //             summary: {
    //                 total_count: 0
    //             }
    //         },
    //         birthday: '03/15/1995',
    //         posts: {
    //             data: [
    //                 {
    //                     id: '122109620762611824_122103324032611824',
    //                     created_time: '2024-11-12T05:34:04+0000',
    //                     attachments: {
    //                         data: [
    //                             {
    //                                 media: {
    //                                     image: {
    //                                         height: 720,
    //                                         src: 'https://scontent-hou1-1.xx.fbcdn.net/v/t39.30808-6/465456302_122103324038611824_6967286699664651226_n.jpg?stp=cp1_dst-jpg_s720x720&_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=1ZYKKeE6wFwQ7kNvgH45RF5&_nc_zt=23&_nc_ht=scontent-hou1-1.xx&edm=ACwmWnUEAAAA&_nc_gid=AngO0WCpk2d6iLPy10ZCg-b&oh=00_AYCsrWOVgPRzZEw0hzOVZieKfTcxG6Zj3yN4Tk0CyPh4bg&oe=6748E6AF',
    //                                         width: 720
    //                                     }
    //                                 },
    //                                 type: 'profile_media'
    //                             }
    //                         ]
    //                     },
    //                     comments: {
    //                         data: [],
    //                         summary: {
    //                             order: 'chronological',
    //                             total_count: 0,
    //                             can_comment: true
    //                         }
    //                     },
    //                     reactions: {
    //                         data: [],
    //                         paging: {
    //                             cursors: {
    //                                 before: 'QVFIUnpPMlQ5QnpVMjlIUndWclpzYUtFamJWSWY2TVh0RXlOTmdiMGpGRHlzU1BjNU5Eb2k2cXBZASEhjT3k0ZA0RfN0hrSXJJNDVvRVUyTXk1dXBVLVdjNWpn',
    //                                 after: 'QVFIUnFqQURTQXlWTVpHclBaQ3JGZAVpKRkdqMGFNNi1kRUFHWXFpQWY1SnR3c1JYWWVvYzN6c2F6LWxwSFpEN3doMTBBUXRoT1o4MzI2dmRvQjBNNnZAyOWVn'
    //                             }
    //                         },
    //                         summary: {
    //                             total_count: 2
    //                         }
    //                     }
    //                 },
    //                 {
    //                     id: '122109620762611824_122103320630611824',
    //                     created_time: '2000-03-07T08:00:00+0000',
    //                     attachments: {
    //                         data: [
    //                             {
    //                                 type: 'life_event'
    //                             }
    //                         ]
    //                     },
    //                     comments: {
    //                         data: [],
    //                         summary: {
    //                             order: 'chronological',
    //                             total_count: 0,
    //                             can_comment: true
    //                         }
    //                     },
    //                     reactions: {
    //                         data: [],
    //                         summary: {
    //                             total_count: 0
    //                         }
    //                     }
    //                 }
    //             ],
    //             paging: {
    //                 previous:
    //                     'https://graph.facebook.com/v21.0/122109620762611824/posts?access_token=EAAIoyUg0XncBOZBjLogmxtvpTbP350ZA76okmF1c5Qnk0FskgRJ29CyWoEgtByVTFQSH1ivEpuZAULRDOOq3N84cYBQWjf7hfTZCq4giGKSTMVhtuM7qWyNiYIYnmt0f8i2aHXldlXd9iod7J9UoVGmDWhUjqmR980mfGGWc9q91ZASRZAJ3ZBw1oZAzTNSnxKk5&fields=id%2Cmessage%2Ccreated_time%2Cattachments%7Bmedia%2Ctype%7D%2Ccomments.summary%28true%29%2Creactions.summary%28total_count%29%2Cshares&__previous=1&since=1731389644&until&__paging_token=enc_AdCDRW7FsEMBB6GbBOU2iUahZBwhSPHUG7rSBg4LyQhggRUHnSMTema9M68XnNwZCFl8Q8j6hZArZBNkfwfhROtyPuEN5hza6TD7qJvhJGhJAIc0RQZDZD',
    //                 next: 'https://graph.facebook.com/v21.0/122109620762611824/posts?access_token=EAAIoyUg0XncBOZBjLogmxtvpTbP350ZA76okmF1c5Qnk0FskgRJ29CyWoEgtByVTFQSH1ivEpuZAULRDOOq3N84cYBQWjf7hfTZCq4giGKSTMVhtuM7qWyNiYIYnmt0f8i2aHXldlXd9iod7J9UoVGmDWhUjqmR980mfGGWc9q91ZASRZAJ3ZBw1oZAzTNSnxKk5&fields=id%2Cmessage%2Ccreated_time%2Cattachments%7Bmedia%2Ctype%7D%2Ccomments.summary%28true%29%2Creactions.summary%28total_count%29%2Cshares&until=952416000&since&__paging_token=enc_AdCvk6rSGBDCgjl9brHFMUUJk6aJSDdaAu4CH7rJ9g7Ywhfzo7n3gzoTpVx05BbSzLtgeh83KmKyQVHZAwZC6Eya0gcfqvodaiY7Ds0Gtnj1LBlwZDZD&__previous'
    //             }
    //         }
    //     }
    // };

    const finalPosts: IFbPost[] = [];
    response.data.posts.data.map((post) => {
        if (post.attachments?.data?.[0].type !== 'life_event') {
            const obj: IFbPost = {
                fbPostId: post.id,
                created_time: post.created_time,
                attachments: (post.attachments?.data?.[0] as any)?.media?.image.src || '',
                comments: post.comments.summary.total_count || 0,
                reactions: post.reactions.summary.total_count || 0,
                message: post?.message,
                shares: post?.shares?.count || 0
            };
            finalPosts.push(obj);
        }
    });
    const finalResponse: IFbProfile = {
        id: response.data.id,
        name: response.data.name,
        picture: response.data.picture.data.url,
        friends: response.data.friends.summary.total_count,
        birthday: response.data.birthday,
        posts: finalPosts
    };
    return finalResponse;
};
