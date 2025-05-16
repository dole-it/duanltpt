// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { login } from '../auth';

// function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Kiểm tra tài khoản mặc định
//       if (email === 'do53231@gmail.com' && password === 'admin12') {
//         const defaultUser = { id: '1', email: 'do53231@gmail.com', password: 'admin12', role: 'admin' };
//         localStorage.setItem('user', JSON.stringify(defaultUser));
//         navigate('/');
//         return;
//       }
//       // Gọi API để đăng nhập nếu không phải tài khoản mặc định
//       await login(email, password);
//       navigate('/');
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg">
//       <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Đăng nhập</h2>
//       {error && <p className="text-red-600 text-center mb-4">{error}</p>}
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Email</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           className="w-full bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition"
//         >
//           Đăng nhập
//         </button>
//       </form>
//     </div>
//   );
// }

// export default Login;