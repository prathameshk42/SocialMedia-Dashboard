import React from 'react';
import { SendIcon } from '../../../../assets';
import useChat from '../../../../hooks/useChat';

const Chat: React.FC = () => {
    const { setCurrentMessage, messages, currentMessage, handleKeyDown, bottomRef, messageSend, loading } = useChat();

    return (
        <div className="flex flex-col h-dvh w-full overflow-scroll">
            <div className="flex flex-col h-full bg-surface p-8 overflow-scroll">
                {messages.length ? (
                    messages?.map((message, index) => {
                        return (
                            <div
                                key={index}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                            >
                                <div
                                    className={`max-w-xs px-4 py-2 rounded-lg text-white ${
                                        message.role === 'user' ? 'bg-emerald' : 'bg-gray-500'
                                    }`}
                                >
                                    {message.content}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex items-center">
                        <div className="relative bg-white border border-gray-300 rounded-lg p-6 shadow-lg w-64">
                            <p className="text-gray-700 text-sm">Lets start a conversation?</p>

                            <div className="absolute bottom-[-10px] left-8 bg-gray-300 rounded-full w-5 h-5"></div>
                            <div className="absolute bottom-[-20px] left-5 bg-gray-300 rounded-full w-3 h-3"></div>
                        </div>
                    </div>
                )}
                {loading && <div className="flex items-center text-xl text-primary">Typing...</div>}
                <div ref={bottomRef} className="pb-4" />
            </div>
            <div className="flex gap-4 p-7">
                <input
                    type="text"
                    value={currentMessage}
                    placeholder={`Type a message`}
                    className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-emerald focus:ring-[0.8] focus:ring-emerald"
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <img width={30} src={SendIcon} className="cursor-pointer" onClick={messageSend} />
            </div>
        </div>
    );
};

export default Chat;
