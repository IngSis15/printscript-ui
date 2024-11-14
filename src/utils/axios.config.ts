import axios from "axios";

const BASE_URL = `${window.location.protocol}//${window.location.hostname}/api`

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


const setAuthorizationToken = (token: string) => {
  axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
};

export { axiosInstance, setAuthorizationToken };