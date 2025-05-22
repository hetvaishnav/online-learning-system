'use client';
import React, { useEffect, useState } from 'react';
import { getCourseById } from '../../../../service/studentservice';
import { useParams } from 'next/navigation';
import { Course } from '../../../../type/admin.type';

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
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">{course.title}</h1>
            <p className="text-gray-600 mb-2">By: {course.teacher?.fullName || 'Unknown'}</p>
            <p className="mb-4 text-gray-700">{course.description}</p>
            <p className="bg-green-100 text-green-800 inline-block px-4 py-2 rounded-full font-semibold">
                ₹{course.price}
            </p>
        </div>
    );
}
