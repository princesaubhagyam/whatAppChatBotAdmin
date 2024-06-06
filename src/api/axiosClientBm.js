import axios from 'axios';

const createAxiosInstance = () => {
  const apiUrl = `https://graph.facebook.com/v20.0/107538912347585/`;
  const instance = axios.create({
    baseURL: apiUrl,
  });

  const authToken =
    'EABN2cqTjBrsBO84auDYo5SK21E6NoW5E2U8i9Uuvu9PimQOzyiFUGyYok2fZAlZB4mFQgeuOjba0id86fBxDA9PneGsWoeOE1hSDUdZB30NomXNXr3C3kZBBTuvPYrYjEJaBNuk6d8ZAlLqX78UdZCsBZA8uX4unXzcG951GZBfynXRVskoJJIQR0ztxOzW5R2kyszUT1DZBQmW3D9ZARzMCX4Hs4JclnZCsIGgzBMvs1r4dR9vVqbjWU1u';
  instance.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
  instance.interceptors.request.use(async (config) => {
    return config;
  });

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.error('Error:', error);
      return Promise.reject(error);
    },
  );

  return instance;
};

const axiosClientBm = createAxiosInstance();
export default axiosClientBm;
