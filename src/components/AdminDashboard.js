// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// function AdminDashboard() {
//   const [users, setUsers] = useState([]);
//   const [error, setError] = useState('');
//   const API_URL = 'https://your-mockapi-id.mockapi.io/users'; // Thay bằng URL MockAPI

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get(API_URL);
//         setUsers(response.data);
//       } catch (err) {
//         setError('Không thể tải danh sách người dùng: ' + err.message);
//       }
//     };
//     fetchUsers();
//   }, []);

//   const deleteUser = async (id) => {
//     try {
//       await axios.delete(`${API_URL}/${id}`);
//       setUsers(users.filter((user) => user.id !== id));
//     } catch (err) {
//       setError('Không thể xóa người dùng: ' + err.message);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg">
//       <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Bảng quản trị</h2>
//       {error && <p className="text-red-600 text-center mb-4">{error}</p>}
//       <div className="overflow-x-auto">
//         <table className="w-full text-left border-collapse">
//           <thead className="bg-green-600 text-white">
//             <tr>
//               <th className="p-4">Email</th>
//               <th className="p-4">Vai trò</th>
//               <th className="p-4">Hành động</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user) => (
//               <tr key={user.id} className="border-b hover:bg-gray-50">
//                 <td className="p-4">{user.email}</td>
//                 <td className="p-4">{user.role}</td>
//                 <td className="p-4">
//                   <button
//                     onClick={() => deleteUser(user.id)}
//                     className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
//                   >
//                     Xóa
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default AdminDashboard;