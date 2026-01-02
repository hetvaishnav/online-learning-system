'use client';
import React, { useEffect, useState } from 'react';
import { getAllCourses, searchCourse } from '../../../service/studentservice';
import { Course } from '../../../type/admin.type';
import { useRouter } from 'next/navigation';

const LIMIT = 15;

export default function StudentDashboard() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();
    useEffect(() => {
        if (searchTerm.trim() === '') {
            fetchCourses();
        } else {
            handleSearch(searchTerm);
        }
    }, [offset]);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const res = await getAllCourses(LIMIT, offset);
            const data = res?.data || [];

            setCourses(data);
            setHasMore(data.length === LIMIT);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (title: string) => {
        setLoading(true);
        try {
            const res = await searchCourse(title);
            const data = res?.data || [];
            setCourses(data);
            setHasMore(false); // disable pagination for search results
        } catch (error) {
            console.error('Error searching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        setOffset(0);
        if (value.trim() === '') {
            fetchCourses();
        } else {
            handleSearch(value);
        }
    };

    const handleNext = () => {
        if (hasMore) setOffset(prev => prev + LIMIT);
    };

    const handlePrev = () => {
        setOffset(prev => Math.max(0, prev - LIMIT));
    };

    return (
        <div className="min-h-screen bg-transparent text-gray-800 font-sans">
            {/* Hero Section with Gradient Background */}
            <div className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 pb-32 pt-12 px-6 shadow-xl">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                        Discover Your Next Passion
                    </h1>
                    <p className="text-blue-50 text-lg md:text-xl max-w-2xl mx-auto">
                        Explore our curated courses and take your skills to the next level.
                    </p>
                </div>
            </div>

            {/* Main Content Container (Overlapping Hero) */}
            <div className="max-w-7xl mx-auto px-6 -mt-24 relative z-10 pb-12">

                {/* Floating Search Bar */}
                <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl mb-12 max-w-3xl mx-auto border border-blue-50/50">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="What do you want to learn today?"
                            value={searchTerm}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border-none rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none text-lg text-gray-700 placeholder-gray-400 transition-all shadow-inner"
                        />
                        <svg className="w-6 h-6 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {courses.map(course => (
                                <div
                                    key={course.id}
                                    onClick={() => router.push(`/student/${course.id}`)}
                                    className="group bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 transform"
                                >
                                    {/* Card Header Gradient */}
                                    <div className="h-32 bg-gradient-to-r from-sky-400 to-blue-500 relative flex items-center justify-center">
                                        <span className="text-6xl text-white/30 font-bold select-none">
                                            {course.title.charAt(0)}
                                        </span>
                                        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-semibold">
                                            {course.teacher?.fullName || 'Instructor'}
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <h2 className="font-bold text-xl text-gray-800 mb-2 truncate group-hover:text-blue-600 transition-colors">
                                            {course.title}
                                        </h2>
                                        <p className="text-sm text-gray-500 mb-4 line-clamp-2 h-10 leading-relaxed">
                                            {course.description}
                                        </p>

                                        <div className="flex justify-between items-center mt-4">
                                            <span className="bg-emerald-50 text-emerald-700 text-sm font-bold px-4 py-1.5 rounded-full border border-emerald-100">
                                                ₹{course.price}
                                            </span>
                                            <span className="text-blue-500 text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform">
                                                View Course
                                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {!searchTerm && (
                            <div className="flex justify-center mt-16 space-x-6">
                                <button
                                    onClick={handlePrev}
                                    disabled={offset === 0}
                                    className="px-6 py-3 bg-white border border-gray-200 text-gray-600 rounded-full shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={handleNext}
                                    disabled={!hasMore}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                                >
                                    Next Page
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
