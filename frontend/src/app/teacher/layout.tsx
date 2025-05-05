// app/teacher/layout.tsx
import Link from 'next/link';

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-800 text-white p-6 space-y-4">
        <h2 className="text-xl font-bold mb-6">Teacher Panel</h2>
        <nav className="flex flex-col space-y-2">
          <Link href="/teacher/addcourse" className="hover:text-gray-300">Add Course</Link>
          <Link href="/teacher/managecourse" className="hover:text-gray-300">Manage Courses</Link>
          <Link href="/teacher/addlessons" className="hover:text-gray-300">Add Lessons</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6">{children}</main>
    </div>
  );
}
