export enum ChatEventEnum {
    // Client → Server events
    JOIN_COURSE_CHAT = 'joinCourseChat',
    SEND_MESSAGE = 'sendMessage',
    LEAVE_COURSE_CHAT = 'leaveCourseChat',

    // Server → Client events
    JOINED_COURSE_CHAT = 'joinedCourseChat',
    RECEIVE_MESSAGE = 'receiveMessage',
    LEFT_COURSE_CHAT = 'leftCourseChat',
    ERROR = 'error',
}

export interface ChatUser {
    id: string;
    email: string;
    role: string;
    fullName?: string; // Added for UI display
    name?: string; // Optional, depends on your user entity
}

export interface ChatRoom {
    id: string;
    name: string;
}

export interface ChatMessage {
    id: string;
    message: string;
    sender: ChatUser;
    chatRoom: ChatRoom; // Updated from courseId to chatRoom object
    createdAt: string;
}

export interface CreateChatDto {
    message: string;
    courseId: string;
    senderId?: string; // Optional, overridden by backend
}
