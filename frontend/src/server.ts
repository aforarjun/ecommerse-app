import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_API_URL}/api/v2`
});
