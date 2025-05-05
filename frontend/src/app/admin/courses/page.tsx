"use client";
import React, { useEffect, useState } from "react";
import { getAllcource } from "../../../../service/adminservice";// Adjust path
import { Course } from "../../../../type/admin.type";

export default function Page() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await getAllcource();
      console.log("response", response);
      if (response && response.data) {
        setCourses(response.data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center text-lg font-medium">Loading courses...</p>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Available Courses</h2>
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl shadow-md p-5 border hover:shadow-lg transition duration-300"
            >
              <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
              <p className="text-gray-600 mb-3">{course.description}</p>
              <p className="text-indigo-600 font-semibold">₹{course.price}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No courses found.</p>
      )}
    </div>
  );
}
