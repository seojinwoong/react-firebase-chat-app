import {
    SET_CURRENT_CHAT_ROOM,
    SET_PRIVATE_CHAT_ROOM
} from './types';

export function setCurrentChatRoom (chatRoom) {
    return {
        type: SET_CURRENT_CHAT_ROOM,
        payload: chatRoom
    }
}
export function setPrivateChatRoom (isPrivateChatRoom) {
    return {
        type: SET_PRIVATE_CHAT_ROOM,
        payload: isPrivateChatRoom
    }
}