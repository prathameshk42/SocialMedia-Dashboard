export type TRole = 'user' | 'assistant';

export interface IMessage {
    role: TRole;
    content: string;
    sentAt: string;
}

export interface IChat {
    messages: IMessage[];
}

export interface ISendMessageProps {
    message: string;
    role: TRole;
}
