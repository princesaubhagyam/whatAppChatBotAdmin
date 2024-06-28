import axios from 'axios';

// const createAxiosInstance = () => {
//   const apiUrl = `https://graph.facebook.com/v20.0/107538912347585/`;
//   const instance = axios.create({
//     baseURL: apiUrl,
//   });

//   const authToken =
//     'EABN2cqTjBrsBO84auDYo5SK21E6NoW5E2U8i9Uuvu9PimQOzyiFUGyYok2fZAlZB4mFQgeuOjba0id86fBxDA9PneGsWoeOE1hSDUdZB30NomXNXr3C3kZBBTuvPYrYjEJaBNuk6d8ZAlLqX78UdZCsBZA8uX4unXzcG951GZBfynXRVskoJJIQR0ztxOzW5R2kyszUT1DZBQmW3D9ZARzMCX4Hs4JclnZCsIGgzBMvs1r4dR9vVqbjWU1u';
//   instance.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
//   instance.interceptors.request.use(async (config) => {
//     return config;
//   });

//   instance.interceptors.response.use(
//     (response) => {
//       return response;
//     },
//     (error) => {
//       console.error('Error:', error);
//       return Promise.reject(error);
//     },
//   );

//   return instance;
// };

// const axiosClientBm = createAxiosInstance();
// export default axiosClientBm;

/*   Example of options : 

{
  addBAId : boolean -> add business account id to base URL
}

*/

const createMetaAxiosInstance = (options) => {
  const defaultReqOptions = {
    addBAId: true,
  };
  const reqOptions = options ?? defaultReqOptions;
  const apiVersion = localStorage.getItem('api_version');
  const authToken = localStorage.getItem('access_meta');

  if (apiVersion && authToken) {
    let metaBaseUrl = `https://graph.facebook.com/${apiVersion}/`;
    if (reqOptions.addBAId) {
      const business_account_id = localStorage.getItem('whatsapp_business_account_id');
      metaBaseUrl = `${metaBaseUrl}${business_account_id}/`;
    }
    const instance = axios.create({
      baseURL: metaBaseUrl,
    });
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
  }
  return undefined;
};

export default createMetaAxiosInstance;
