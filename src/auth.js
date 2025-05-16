import axios from 'axios';

const API_URL = 'https://your-mockapi-id.mockapi.io/users'; // Thay bằng URL MockAPI của bạn

export const register = async (email, password, role) => {
  try {
    const response = await axios.post(API_URL, { email, password, role });
    return response.data;
  } catch (error) {
    throw new Error('Đăng ký thất bại: ' + (error.response?.data?.message || error.message));
  }
};

export const login = async (email, password) => {
  try {
    const response = await axios.get(`${API_URL}?email=${email}&password=${password}`);
    if (response.data.length > 0) {
      const user = response.data[0];
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    }
    throw new Error('Email hoặc mật khẩu không đúng');
  } catch (error) {
    throw new Error('Đăng nhập thất bại: ' + (error.response?.data?.message || error.message));
  }
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};