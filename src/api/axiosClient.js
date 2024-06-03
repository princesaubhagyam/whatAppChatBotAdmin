import axios from 'axios';

const createAxiosInstance = () => {
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const instance = axios.create({
    baseURL: apiUrl,
  });
  instance.interceptors.request.use(async (config) => {
    return config;
  });

  return instance;
};

const apiClient = createAxiosInstance();
export default apiClient;
