'use client';
import React, { useEffect, useState } from 'react';
import { getAllusers } from '../../../../service/adminservice';
import { User } from '../../../../type/admin.type';


export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);
  const fetchUsers = async () => {
    try {
      const res = await getAllusers(); // adjust API path as needed
      setUsers(res?.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">All Users</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="bg-white shadow rounded p-4">
              <h3 className="font-semibold text-lg">{user.fullName}</h3>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500">Role: {user.role}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
