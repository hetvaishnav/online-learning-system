import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../../hooks/useChat';
import { ChatMessage } from '../../types/chat';

interface ChatWindowProps {
    courseId: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ courseId }) => {
    const { messages, sendMessage, isConnected, error, currentUserId } = useChat(courseId);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            sendMessage(inputValue);
            setInputValue('');
        }
    };

    return (
        <div className="flex flex-col h-[600px] w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-lg">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                <h2 className="text-lg font-semibold text-gray-800">Course Chat</h2>
                <div className="flex items-center gap-2 text-sm">
                    <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <span className="text-gray-600">{isConnected ? 'Connected' : 'Disconnected'}</span>
                </div>
                {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50/50">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-400 my-auto text-sm">No messages yet. Say hello!</div>
                ) : (
                    messages.map((msg, idx) => {
                        // Check if message is from current user
                        const isMe = currentUserId === msg.sender?.id;

                        return (
                            <div key={idx} className={`flex flex-col max-w-[80%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
                                <div className={`flex items-baseline gap-2 mb-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                                    <span className="text-xs font-bold text-gray-700">{msg.sender?.fullName || msg.sender?.email || 'Unknown'}</span>
                                    <span className="text-[10px] text-gray-400">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div className={`p-3 rounded-2xl shadow-sm text-sm break-words ${isMe
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                                    }`}>
                                    {msg.message}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 border-t border-gray-200 bg-white rounded-b-lg flex gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type a message..."
                    disabled={!isConnected}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-gray-100 placeholder-gray-400 text-black"
                />
                <button
                    type="submit"
                    disabled={!isConnected || !inputValue.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 translate-x-0.5 -translate-y-0.5">
                        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                    </svg>
                </button>
            </form>
        </div>
    );
};
