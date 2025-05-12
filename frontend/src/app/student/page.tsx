'use client';
import React, { useEffect, useState } from 'react';
import { getAllCourses } from '../../../service/studentservice';// adjust path
import { Course } from '../../../type/admin.type'; // adjust type path

const LIMIT = 15; // Courses per page

export default function StudentDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, [offset]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await getAllCourses(LIMIT, offset); // API should support limit & offset
      console.log({res});
      const data = res?.data || [];

      setCourses(data);
      setHasMore(data.length === LIMIT); // If returned less than limit, no more pages
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
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

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {courses.map(course => (
              <div key={course.id} className="bg-white p-4 rounded shadow">
                <h2 className="font-semibold text-lg">{course.title}</h2>
                <p className="text-sm text-gray-600">{course.description}</p>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
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
        </>
      )}
    </div>
  );
}
