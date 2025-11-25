// src/api/axiosInstance.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust as needed
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
