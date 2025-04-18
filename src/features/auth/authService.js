import axios from 'axios';

// Update this to match your backend port (5000)
const API_URL = 'http://localhost:5000/api/users/';

const authService = {
  login: async (userData) => {
    try {
      const response = await axios.post(API_URL + 'login', userData);
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
      }
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  logout: () => {
    localStorage.removeItem('user');
  localStorage.removeItem('token');
  },

  register: async (userData) => {
    const response = await axios.post(API_URL + 'register', userData);
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
    }
    return response.data;
  }
};

export default authService;