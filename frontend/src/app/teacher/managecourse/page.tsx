'use client';
import React, { useEffect, useState } from 'react';
import { getTeacherCources, deleteCourse, addLesson, addvideo, getEnrollStudent } from '../../../../service/teacherservice';
import { Course } from '../../../../type/admin.type';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';

export default function Page() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [lessonType, setLessonType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [lessonOrder, setLessonOrder] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [contentUrl, setContentUrl] = useState('');
  const [enrolledStudents, setEnrolledStudents] = useState<any[]>([]);
  const [showEnrolledModal, setShowEnrolledModal] = useState(false);

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

  const handleAddLessonClick = (courseId: string) => {
    setSelectedCourseId(courseId);
    setShowForm(true);
  };

  const handleGetEnrolledStudents = async (courseId: string) => {
    try {
      const res = await getEnrollStudent(courseId);
      if (res?.data) {
        setEnrolledStudents(res.data);
        setShowEnrolledModal(true);
      }else{
        console.log("object");
        toast('No enroll student in rhis course')
      }
    } catch (error) {
      alert('Failed to fetch enrolled students');
      console.error(error);
    }
  };

  const handleLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (lessonType === 'video') {
        if (!selectedCourseId) {
          alert("Please select a course.");
          return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('courseId', selectedCourseId);
        if (file) {
          formData.append('file', file);
        }

        const res = await addvideo(formData);
        console.log("video", { res });
        if (res) {
          alert('Video uploaded successfully');
        }
      } else {
        const payload = {
          title,
          description,
          lessonOrder,
          contentType: lessonType,
          contentUrl: lessonType === 'pdf' ? '' : contentUrl,
          courseId: selectedCourseId,
        };

        if (lessonType === 'pdf' && file) {
          const formData = new FormData();
          formData.append('file', file);
          const uploadRes = await addLesson(formData);
          payload.contentUrl = uploadRes?.data.fileUrl;
        }

        const res = await addLesson(payload);
        console.log("lesson", { res });
        if (res) {
          alert('Lesson added successfully');
        }
      }

      setShowForm(false);
      setTitle('');
      setDescription('');
      setLessonOrder(1);
      setLessonType('');
      setContentUrl('');
      setFile(null);
    } catch (error) {
      console.error('Error adding lesson/video', error);
      alert('Failed to add lesson/video');
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
            <div className="space-x-2">
              <Link href={`/teacher/updatecourse/${course.id}`}>
                <button className="bg-blue-500 text-white px-3 py-1 rounded">Update</button>
              </Link>
              <button
                onClick={() => handleDelete(course.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
              <button
                onClick={() => handleAddLessonClick(course.id)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Add Lesson
              </button>
              <button
                onClick={() => handleGetEnrolledStudents(course.id)}
                className="bg-purple-600 text-white px-3 py-1 rounded"
              >
                Get Enrolled Students
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form
            onSubmit={handleLessonSubmit}
            className="bg-white p-6 rounded shadow max-w-md space-y-4"
          >
            <h2 className="text-lg font-bold">Add Lesson</h2>

            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />

            <select
              value={lessonType}
              onChange={(e) => setLessonType(e.target.value)}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Select Lesson Type</option>
              <option value="text">Text</option>
              <option value="pdf">PDF</option>
              <option value="video">Video</option>
            </select>

            {lessonType === 'text' && (
              <>
                <textarea
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border p-2 rounded"
                />
                <input
                  type="number"
                  placeholder="Lesson Order"
                  value={lessonOrder}
                  onChange={(e) => setLessonOrder(parseInt(e.target.value))}
                  className="w-full border p-2 rounded"
                  min={1}
                  required
                />
                <input
                  type="text"
                  placeholder="Text Content"
                  value={contentUrl}
                  onChange={(e) => setContentUrl(e.target.value)}
                  className="w-full border p-2 rounded"
                  required
                />
              </>
            )}

            {lessonType === 'pdf' && (
              <>
                <textarea
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border p-2 rounded"
                />
                <input
                  type="number"
                  placeholder="Lesson Order"
                  value={lessonOrder}
                  onChange={(e) => setLessonOrder(parseInt(e.target.value))}
                  className="w-full border p-2 rounded"
                  min={1}
                  required
                />
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full border p-2 rounded"
                  required
                />
              </>
            )}

            {lessonType === 'video' && (
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full border p-2 rounded"
                required
              />
            )}

            <div className="flex justify-between">
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">
                Save Lesson
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showEnrolledModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">showEnrolledModal
            <h2 className="text-lg font-bold mb-4">Enrolled Students</h2>
            {enrolledStudents.length > 0 ? (
              <ul className="space-y-2 max-h-60 overflow-y-auto">
                {enrolledStudents.map((student, index) => (
                  <li key={index} className="border p-2 rounded">
                    <p><strong>Name:</strong> {student.name}</p>
                    <p><strong>Email:</strong> {student.email}</p>
                  </li>
                ))}
              </ul>
            ) : 
              <p>No students enrolled.</p>
            }
            <div className="mt-4 text-right">
              <button
                onClick={() => setShowEnrolledModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
