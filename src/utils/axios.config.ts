import { BACKEND_URL } from './constants.ts';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const setAuthorizationToken = (token: string) => {
  axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
};

export { axiosInstance, setAuthorizationToken };
