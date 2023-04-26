import {
    SET_CURRENT_CHAT_ROOM,
} from './types';

export function setCurrentChatRoom (chatRoom) {
    return {
        type: SET_CURRENT_CHAT_ROOM,
        payload: chatRoom
    }
}