'use client';
import React, { useEffect, useState } from 'react';
import { getTeacherCources, deleteCourse } from '../../../../service/teacherservice';
import { Course } from '../../../../type/admin.type';
import { useRouter } from 'next/navigation';

export default function Page() {
  const [courses, setCourses] = useState<Course[]>([]);
  const router = useRouter();
  const teacherId = '576ebd30-9101-4b50-8018-277ff57e5df3';

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await getTeacherCources(teacherId);
      setCourses(res?.data || []);
    } catch (error) {
      console.error('Error fetching teacher courses', error);
    }
  };

  const handleDelete = async (courseId: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse(courseId);
        alert('Course deleted');
        fetchCourses(); 
      } catch (error) {
        console.error('Delete failed', error);
      }
    }
  };

  const handleUpdate = (courseId: string) => {
    router.push(`/teacher/updatecourse/${courseId}`); 
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">My Courses</h2>
      <div className="space-y-4">
        {courses.map((course) => (
          <div key={course.id} className="bg-white p-4 rounded shadow space-y-2">
            <h3 className="font-bold text-lg">{course.title}</h3>
            <p>{course.description}</p>
            <div className="space-x-2">
              <button
                onClick={() => handleUpdate(course.id)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Update
              </button>
              <button
                onClick={() => handleDelete(course.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
