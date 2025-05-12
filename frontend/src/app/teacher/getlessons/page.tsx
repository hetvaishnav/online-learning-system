'use client';
import React, { useEffect, useState } from 'react';
import { getAddedLesson, getTeacherCources } from '../../../../service/teacherservice';
import { Course, Lesson } from '../../../../type/admin.type';
import { useRouter } from 'next/navigation';

export default function Page() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const router = useRouter();
  const teacherId = '576ebd30-9101-4b50-8018-277ff57e5df3';

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      fetchLessons(selectedCourseId);
    }
  }, [selectedCourseId]);

  const fetchCourses = async () => {
    try {
      const res = await getTeacherCources(teacherId);
      setCourses(res?.data || []);
    } catch (error) {
      console.error('Error fetching teacher courses', error);
    }
  };

  const fetchLessons = async (courseId: string) => {
    try {
      const res = await getAddedLesson(courseId);
      console.log({res});
      setLessons(res?.data.lessons || []);
    } catch (error) {
      console.error('Error fetching lessons', error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">My Courses</h2>

      {/* Top Bar with Courses */}
      <ul className="flex space-x-4 overflow-x-auto bg-gray-100 p-2 rounded">
        {courses.map((course) => (
          <li
            key={course.id}
            onClick={() => setSelectedCourseId(course.id)}
            className={`cursor-pointer px-4 py-2 rounded ${
              selectedCourseId === course.id ? 'bg-blue-500 text-white' : 'bg-white hover:bg-blue-100'
            }`}
          >
            {course.title}
          </li>
        ))}
      </ul>

      {/* Lessons */}
      <div className="mt-6 space-y-4">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="bg-white p-4 rounded shadow space-y-2">
            <h3 className="font-bold text-lg">{lesson.title}</h3>
            <p>{lesson.description}</p>
            <p>Type: {lesson.contentType}</p>
            <p>Order: {lesson.lessonOrder}</p>
            <p>URL: {lesson.contentUrl}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
