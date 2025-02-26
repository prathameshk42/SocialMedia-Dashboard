import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, ReduxState } from '../redux';
import { useRef, useState } from 'react';
import { saveMessage } from '../redux/ChatSlice';
import { sendMessage } from '../adapters';
import { IMessage } from '../redux/ChatSlice/types';

const useChat = () => {
    const bottomRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch<AppDispatch>();
    const [currentMessage, setCurrentMessage] = useState<string>('');
    const messages = useSelector((state: ReduxState) => state.chat.messages);
    const [loading, setLoading] = useState<boolean>(false);

    const messageSend = async () => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        setLoading(true);
        const messageToSend: IMessage = { content: currentMessage, role: 'user', sentAt: new Date().toString() };
        const updatedMessages = messages.concat(messageToSend);
        dispatch(saveMessage({ message: currentMessage, role: 'user' }));
        setCurrentMessage('');
        const reply: any = await sendMessage(updatedMessages);
        dispatch(saveMessage({ message: reply.content, role: reply.role }));
        setLoading(false);
    };

    const handleKeyDown = async (event) => {
        if (event.key === 'Enter') {
            await messageSend();
        }
    };

    return { messages, setCurrentMessage, currentMessage, handleKeyDown, bottomRef, messageSend, loading };
};

export default useChat;
