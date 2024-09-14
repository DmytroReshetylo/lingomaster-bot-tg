import { MessageChatInfo } from './message-chat-info.type';
import { MessageFromInfo } from './message-from-info.type';

export type MessageInfo = {
    message_id: number;
    from: MessageFromInfo;
    chat: MessageChatInfo;
    date: number;
    text: string;
}