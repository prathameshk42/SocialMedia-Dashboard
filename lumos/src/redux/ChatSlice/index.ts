import { createSlice, current } from '@reduxjs/toolkit';
import { IChat, ISendMessageProps } from './types';

const initialState: IChat = {
    messages: []
};

const chatSlice = createSlice({
    name: 'chat',
    initialState: initialState,
    reducers: {
        saveMessage: (state, { payload }: { payload: ISendMessageProps }) => {
            const messages = current(state.messages);
            const updatedMessages = messages.concat({
                role: payload.role,
                content: payload.message,
                sentAt: new Date().toString()
            });
            return { messages: updatedMessages };
        },
        resetChat: () => {
            return { ...initialState };
        }
    },
    extraReducers(builder) {}
});

export default chatSlice.reducer;
export const { saveMessage, resetChat } = chatSlice.actions;
