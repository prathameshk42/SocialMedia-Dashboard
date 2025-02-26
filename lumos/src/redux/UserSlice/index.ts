import { createSlice, current } from '@reduxjs/toolkit';

interface IUser {
    email: string;
    isVerified: boolean;
    name: string;
    age: string;
    gender: string;
    userId: string;
    twitterAccessToken: string;
    twitterAccessTokenSecret: string;
    twitterUserName: string;
    twitterName: string;
    twitterId: string;
    instaAccessToken: string;
    fbAccessToken: string;
}

const initialState: IUser = {
    email: '',
    isVerified: false,
    name: '',
    age: '',
    gender: '',
    userId: '',
    twitterAccessToken: '',
    twitterAccessTokenSecret: '',
    twitterUserName: '',
    twitterName: '',
    twitterId: '',
    instaAccessToken: '',
    fbAccessToken: ''
};

const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        updateUserDetails(state, action) {
            const currentDetails = current(state);
            return { ...currentDetails, ...action.payload };
        },
        resetUser() {
            return { ...initialState };
        }
    },
    extraReducers(builder) {}
});

export default userSlice.reducer;
export const { updateUserDetails, resetUser } = userSlice.actions;
