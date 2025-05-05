'use client';
import { useState } from 'react';
import axios from 'axios';
import { addCourse } from '../../../../service/teacherservice';

export default function AddCoursePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [price, setPrice] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [teacherId, setTeacherId] = useState(''); // Ideally fetched from auth/user context

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title,
        description,
        category,
        thumbnail,
        teacherId,
        price: price ? parseFloat(price) : undefined,
        isPublished,
        startDate,
        endDate,
      };
      await addCourse(payload);
      alert('Course created successfully');
      setTitle('');
      setDescription('');
      setCategory('');
      setThumbnail('');
      setPrice('');
      setIsPublished(false);
      setStartDate('');
      setEndDate('');
      setTeacherId('');
    } catch (error) {
      console.error('Course creation failed:', error);
      alert('Failed to create course');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl bg-white p-6 rounded shadow mx-auto mt-10">
      <h2 className="text-2xl font-bold">Add New Course</h2>

      <input
        type="text"
        placeholder="Course Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
        required
      />

      <textarea
        placeholder="Course Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
        required
      />

      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
      />

      <input
        type="text"
        placeholder="Thumbnail URL"
        value={thumbnail}
        onChange={(e) => setThumbnail(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
      />

      <input
        type="number"
        placeholder="Price (optional)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
      />

      <input
        type="text"
        placeholder="Teacher ID (UUID)"
        value={teacherId}
        onChange={(e) => setTeacherId(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
        required
      />

      <div className="flex gap-4">
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border border-gray-300 rounded"
            required
          />
        </div>
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
        />
        <span>Publish Course</span>
      </label>

      <button
        type="submit"
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
      >
        Create Course
      </button>
    </form>
  );
}
