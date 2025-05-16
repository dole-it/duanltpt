import React from 'react';
import { getUser } from '../auth';

function Profile() {
  const user = getUser();

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Hồ sơ cá nhân</h2>
      <div className="space-y-4">
        <p className="text-gray-700"><strong>Email:</strong> {user.email}</p>
        <p className="text-gray-700"><strong>Vai trò:</strong> {user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}</p>
      </div>
    </div>
  );
}

export default Profile;