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
// export default apiClient;
// import axios from 'axios';

// const createAxiosInstanceWithToken = () => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     const instance = axios.create({
//       baseURL: process.env.REACT_APP_API_BASE_URL,
//       headers: {
//         Authorization: `Bearer ${JSON.parse(token).access}`,
//       },
//     });
//     return instance;
//   } else {
//     return axios.create({
//       baseURL: process.env.REACT_APP_API_BASE_URL,
//     });
//   }
// };

// const apiClient = createAxiosInstanceWithToken();
export default apiClient;
