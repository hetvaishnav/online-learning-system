'use client';
import React, { useEffect, useState } from 'react';
import { getCourseById } from '../../../../service/studentservice';
import { useParams } from 'next/navigation';
import { Course } from '../../../../type/admin.type';
import { ChatWindow } from '../../../components/chat/ChatWindow';

export default function CourseDetailPage() {
    const params = useParams();
    const courseId = params.courseId;
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!courseId) return;
        const fetchCourse = async (courseId: string) => {
            try {
                const res = await getCourseById(courseId);
                setCourse(res?.data || null);
            } catch (error) {
                console.error('Error loading course:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse(courseId as string);
    }, [courseId]);

    if (loading) return <p className="p-6">Loading...</p>;
    if (!course) return <p className="p-6">Course not found</p>;

    return (
        <div className="min-h-screen bg-gray-50/30">
            {/* Header / Hero */}
            <div className="bg-white shadow-sm border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <h1 className="text-3xl font-extrabold text-gray-800 mb-2">{course.title}</h1>
                    <div className="flex items-center text-gray-500 space-x-4">
                        <span className="flex items-center">
                            <svg className="w-5 h-5 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            {course.teacher?.fullName || 'Unknown Instructor'}
                        </span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="text-blue-600 font-bold text-lg">₹{course.price}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-100">About this Course</h2>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            {course.description}
                        </p>
                        <div className="mt-8">
                            {/* Placeholder for future lessons list or video player */}
                            <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200">
                                Course Content / Video Player Placeholder
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Chat & Actions */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="sticky top-6">
                        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden ring-4 ring-gray-50">
                            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 text-white">
                                <h3 className="font-bold flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                    Live Discussion
                                </h3>
                            </div>
                            {/* Passing full height to chat window via class or wrapping */}
                            <div className="h-[600px]">
                                <ChatWindow courseId={courseId as string} />
                            </div>
                        </div>

                        <div className="mt-6 text-center text-xs text-gray-400">
                            Community Guidelines Apply
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
