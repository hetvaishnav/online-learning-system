// app/student/layout.tsx
import React from 'react';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <header className="bg-blue-600 text-white p-4">Student Dashboard</header>
      <main className="p-4">{children}</main>
    </div>
  );
}
