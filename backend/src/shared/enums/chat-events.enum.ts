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
