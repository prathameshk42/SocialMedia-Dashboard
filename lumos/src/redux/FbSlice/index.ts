import { createSlice, current } from '@reduxjs/toolkit';
import { IFbProfile } from './types';

const initialState: IFbProfile = {
    id: '',
    name: '',
    picture: '',
    friends: 0,
    birthday: '',
    posts: []
};

const fbSlice = createSlice({
    name: 'fb',
    initialState: initialState,
    reducers: {
        updateFbProfile(state, { payload }: { payload: IFbProfile }) {
            return { ...payload };
        },
        resetFb() {
            return { ...initialState };
        }
    },
    extraReducers(builder) {}
});

export default fbSlice.reducer;
export const { updateFbProfile, resetFb } = fbSlice.actions;
