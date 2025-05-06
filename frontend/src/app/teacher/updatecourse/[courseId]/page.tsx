'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { getCoursebyId, updateCource } from '../../../../../service/teacherservice';

export default function Page() {
  const { courseId } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
  });

  useEffect(() => {
    if (courseId) {
      fetchCourse(courseId as string);
    }
  }, [courseId]);

  const fetchCourse = async (id: string) => {
    try {
      const response = await getCoursebyId(id)
      const course = response?.data;
      setFormData({
        title: course.title,
        description: course.description,
        price: String(course.price),
      });
    } catch (error) {
      console.error('Failed to fetch course:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateCource(courseId as string, {
        ...formData,
        price: parseFloat(formData.price),
      });
      alert('Course updated');
      router.push('/teacher');
    } catch (error) {
      console.error('Failed to update course:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold">Update Course</h2>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Title"
        className="w-full p-2 border border-gray-300 rounded"
        required
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full p-2 border border-gray-300 rounded"
        required
      />
      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        placeholder="Price"
        className="w-full p-2 border border-gray-300 rounded"
        required
      />
      <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">
        Update Course
      </button>
    </form>
  );
}
