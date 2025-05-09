'use client';
import React, { useEffect, useState } from 'react';
import { getTeacherCources, deleteCourse, addLesson, addvideo, getEnrollStudent } from '../../../../service/teacherservice';
import { Course } from '../../../../type/admin.type';
import { useRouter } from 'next/navigation';

export default function Page() {
  const [courses, setCourses] = useState<Course[]>([]);

  const router = useRouter();
  const teacherId = '576ebd30-9101-4b50-8018-277ff57e5df3';

  useEffect(() => {
    fetchCourses();
  }, []);
  useEffect(() => {
    //fetchLessons();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await getTeacherCources(teacherId);
      setCourses(res?.data || []);
    } catch (error) {
      console.error('Error fetching teacher courses', error);
    }
  };
  const fetchLessons = async (courseId:string) => {
    try {
      const res = await getTeacherCources(courseId);
      setCourses(res?.data || []);
    } catch (error) {
      console.error('Error fetching teacher courses', error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">My Courses</h2>
      <div className="space-y-4">
        {courses.map((course) => (
          <div key={course.id} className="bg-white p-4 rounded shadow space-y-2">
            <h3 className="font-bold text-lg">{course.title}</h3>
            <p>{course.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
