import { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { ChatEventEnum, ChatMessage, CreateChatDto } from '../types/chat';
import { jwtDecode } from 'jwt-decode';

const SOCKET_URL = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/chat`; // Adjust if backend runs on different port

interface JwtPayload {
    userId: string;
    email: string;
    role: string;
    // add other fields if necessary
}

export const useChat = (courseId: string) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [chatRoomId, setChatRoomId] = useState<string | null>(null);
    const socketRef = useRef<Socket | null>(null);

    // 1. Get Token & User ID
    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            setError('No authentication token found');
            return;
        }
        try {
            const decoded = jwtDecode<JwtPayload>(token);
            setCurrentUserId(decoded.userId);
        } catch (e) {
            console.error('Failed to decode token:', e);
        }
    }, []);

    // 2. Fetch Chat Room ID for the course
    useEffect(() => {
        const fetchChatRoom = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('No authentication token found');
                    return;
                }
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/chat/room/${courseId}`, {
                    headers: { 'Authorization': `${token}` }
                });

                if (!response.ok) throw new Error('Failed to get chat room');

                const room = await response.json();
                setChatRoomId(room.id);
            } catch (err) {
                setError('Could not load chat room');
            }
        };

        if (courseId) {
            fetchChatRoom();
        }
    }, [courseId]);

    // 3. Connect Socket & Join Room
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token || !chatRoomId) return;

        socketRef.current = io(SOCKET_URL, {
            auth: { token },
            query: { token },
        });

        const socket = socketRef.current;

        socket.on('connect', () => {
            setIsConnected(true);
            setError(null);
            // Join using chatRoomId
            socket.emit(ChatEventEnum.JOIN_COURSE_CHAT, { chatRoomId });
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        socket.on('connect_error', (err) => {
            setError(err.message);
            setIsConnected(false);
        });

        socket.on(ChatEventEnum.RECEIVE_MESSAGE, (message: ChatMessage) => {
            setMessages((prev) => {
                if (prev.some(m => m.id === message.id)) return prev;
                return [...prev, message];
            });
        });

        return () => {
            if (socket.connected) {
                socket.emit(ChatEventEnum.LEAVE_COURSE_CHAT, { chatRoomId });
                socket.disconnect();
            }
        };
    }, [chatRoomId]); // Re-run when chatRoomId is ready

    // 4. Fetch History
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/chat/course/${courseId}`, {
                    headers: { 'Authorization': `${token}` }
                });

                if (!response.ok) throw new Error('Failed to fetch history');

                const data: ChatMessage[] = await response.json();
                setMessages(data);
            } catch (err: any) {
                console.error('Failed to fetch history:', err);
            }
        };

        if (courseId) {
            fetchHistory();
        }
    }, [courseId]);

    const sendMessage = useCallback((message: string) => {
        if (socketRef.current && isConnected) {
            const payload: CreateChatDto = {
                courseId,
                message,
            };
            socketRef.current.emit(ChatEventEnum.SEND_MESSAGE, payload);
        }
    }, [courseId, isConnected]);

    return {
        messages,
        sendMessage,
        isConnected,
        error,
        currentUserId
    };
};
