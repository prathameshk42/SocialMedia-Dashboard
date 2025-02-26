import { createSlice, current } from '@reduxjs/toolkit';
import { ITweet, ITweetProps, ITweets } from './types';

const initialState: ITweets = {
    tweets: [],
    fetchedAt: '',
    profile: null
};

const tweetsSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        updateTweets(state, { payload }: { payload: ITweetProps }) {
            return { tweets: payload.tweets, fetchedAt: new Date().toString(), profile: payload.profile };
        },
        updateTweet(state, { payload }: { payload: ITweet }) {
            const currentState = current(state);
            const updatedTweets = [payload].concat(currentState.tweets);
            return { tweets: updatedTweets, fetchedAt: currentState.fetchedAt, profile: currentState.profile };
        },
        deleteTweet(state, { payload }: { payload: string }) {
            const currentState = current(state);
            const updatedTweets = currentState.tweets.filter((tweet) => tweet.id !== payload);
            return { tweets: updatedTweets, fetchedAt: currentState.fetchedAt, profile: currentState.profile };
        },
        resetTweet() {
            return { ...initialState };
        }
    },
    extraReducers(builder) {}
});

export default tweetsSlice.reducer;
export const { updateTweets, updateTweet, deleteTweet, resetTweet } = tweetsSlice.actions;
