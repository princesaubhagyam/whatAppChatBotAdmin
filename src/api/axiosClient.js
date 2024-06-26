import axios from 'axios';

const createAxiosInstance = () => {
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const instance = axios.create({
    baseURL: apiUrl,
  });

  instance.interceptors.request.use(
    async (config) => {
      const token = localStorage.getItem('access_app');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  return instance;
};

const apiClient = createAxiosInstance();
export default apiClient;
