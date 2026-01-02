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
        <div className="flex flex-col h-full bg-white/50 backdrop-blur-sm">

            {/* Header - Minimalist */}
            <div className="px-4 py-3 border-b border-gray-100 bg-white/80 backdrop-blur-md flex justify-between items-center z-10">
                <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500'}`}></div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{isConnected ? 'Online' : 'Offline'}</span>
                </div>
                {error && <span className="text-xs text-rose-500 font-medium px-2 py-1 bg-rose-50 rounded-md">Error Connecting</span>}
            </div>

            {/* Messages Area */}
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-gray-50/30 scroll-smooth">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
                        <div className="bg-blue-50 p-4 rounded-full mb-3">
                            <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        </div>
                        <p className="text-sm text-gray-400 font-medium">No messages yet.<br />Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => {
                        const isMe = currentUserId === msg.sender?.id;

                        return (
                            <div key={idx} className={`flex flex-col max-w-[85%] animate-fade-in-up ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
                                <div className={`flex items-baseline gap-2 mb-1 opacity-90 ${isMe ? 'flex-row-reverse' : ''}`}>
                                    <span className={`text-[11px] font-bold ${isMe ? 'text-blue-600' : 'text-gray-600'}`}>
                                        {isMe ? 'You' : (msg.sender?.fullName || msg.sender?.email?.split('@')[0] || 'Unknown')}
                                    </span>
                                    <span className="text-[10px] text-gray-400">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>

                                <div className={`px-4 py-2.5 shadow-sm text-sm break-words relative group transition-all duration-200 ${isMe
                                    ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-2xl rounded-tr-sm shadow-blue-200'
                                    : 'bg-white border border-gray-100 text-gray-700 rounded-2xl rounded-tl-sm shadow-gray-100'
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
            <div className="p-4 bg-white border-t border-gray-100">
                <form onSubmit={handleSend} className="relative flex items-center">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type your message..."
                        disabled={!isConnected}
                        className="w-full pl-5 pr-14 py-3.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm text-gray-700 placeholder-gray-400 shadow-inner"
                    />
                    <button
                        type="submit"
                        disabled={!isConnected || !inputValue.trim()}
                        className="absolute right-2 p-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full shadow-lg hover:shadow-blue-500/40 transform hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 translate-x-0.5">
                            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
};
