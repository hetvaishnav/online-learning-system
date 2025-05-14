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
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Student Dashboard - Courses</h1>

            {/* Search Input */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by course title..."
                    value={searchTerm}
                    onChange={handleInputChange}
                    className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {courses.map(course => (
                            <div
                                key={course.id}
                                className="bg-white p-4 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                            >
                                <div className="flex items-center mb-3 space-x-3">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-lg font-bold">
                                        {course.title.charAt(0)}
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-lg text-gray-800">{course.title}</h2>
                                        <p className="text-sm text-gray-500">{course.teacher?.fullName || 'Unknown Teacher'}</p>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-700 mb-3 line-clamp-3">{course.description}</p>

                                <div className="flex justify-between items-center">
                                    <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                                        ₹{course.price}
                                    </span>
                                    

<button
    onClick={() => router.push(`/student/${course.id}`)}
    className="text-blue-600 hover:underline text-sm font-medium"
>
    View Details
</button>

                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {!searchTerm && (
                        <div className="flex justify-center mt-6 space-x-4">
                            <button
                                onClick={handlePrev}
                                disabled={offset === 0}
                                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={!hasMore}
                                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
