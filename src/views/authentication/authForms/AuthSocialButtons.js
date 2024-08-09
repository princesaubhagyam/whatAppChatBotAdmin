import React, { useEffect } from 'react';
// import icon1 from 'src/assets/images/svgs/google-icon.svg';
import icon2 from 'src/assets/images/svgs/facebook-icon.svg';
import CustomSocialButton from '../../../components/forms/theme-elements/CustomSocialButton';
import { Stack } from '@mui/system';
import { Avatar, Box } from '@mui/material';
import { useNavigate } from 'react-router';
import apiClient from 'src/api/axiosClient';
// import { functionsIn } from 'lodash';

const AuthSocialButtons = ({ title }) => {
  const navigate = useNavigate();
  // const [userInfo, setUserInfo] = useState({})



  useEffect(() => {
    // Load the Facebook SDK asynchronously
    const loadFbSdk = () => {
      window.fbAsyncInit = function () {
        window.FB.init({
          appId: '5478259322193595',
          cookie: true,
          autoLogAppEvents: true,
          xfbml: true,
          version: 'v20.0',
        });
      };

      (function (d, s, id) {
        const fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        const js = d.createElement(s);
        js.id = id;
        js.src = 'https://connect.facebook.net/en_US/sdk.js';
        fjs.parentNode.insertBefore(js, fjs);
      })(document, 'script', 'facebook-jssdk');
    };

    // Check if the SDK is already loaded
    if (!window.FB) {
      loadFbSdk();
    }
  }, []);

  const launchWhatsAppSignup = () => {
    if (!window.FB) {
      console.error('Facebook SDK not loaded yet.');
      return;
    }

    window.FB.login(
      function (response) {
        if (response.authResponse) {
          const accessToken = response.authResponse.code;
          if (accessToken) {
            getAccessTokenForBusiness(accessToken)
          }
          else {
            console.error("Access Token is not found")
          }
        } else {
          console.log('User cancelled login or did not fully authorize.');
          navigate('/auth/login');
        }
      },
      {
        config_id: '1902067633621358',
        response_type: 'code',
        override_default_response_type: true,
        extras: {
          feature: 'whatsapp_embedded_signup',
          version: 2,
          sessionInfoVersion: 2,
        },
      },
    );
  };


 function getAccessTokenForBusiness(accessToken){
  try {
    apiClient.get(`auth/get_access_token_for_business/?code=${accessToken}`)
    .then((response) => {
      if(response.data.status){
        getBusinessId(response.data.data.access_token)
      }
    }).catch((error)=>{
      console.error(error)
    })
  } catch (error) {
    
  }
 }
 
function getBusinessId(access_token){
  try {
    apiClient.get(`auth/get_business_id?input_token=${access_token}`, {
      headers: {
        'Access-Token': access_token,
      }
    })
      .then((response) => {
        if(response.data.status){
          const businessId = response.data.data.data.granular_scopes.find(scopeObj => scopeObj.scope === "whatsapp_business_messaging");
          getWhatsappBusinessMessaging(access_token,businessId.target_ids[0])
        }
      })
      .catch((error) => {
        console.log(error)
      })
  } catch (error) {
    console.error(error,"error")
  }
}

  function getWhatsappBusinessMessaging(access_token, id){
    try {
      apiClient.get(`auth/get_phone_id/${id}`, {
        headers: {
          'Access-Token': access_token,
        }
      })
        .then((response) => {
          console.log(response, "response====")
        })
        .catch((error) => {
          console.log(error)
        })
    } catch (error) {
      console.error(error,"error")
    }
  }

  return (
    <>
      <Stack direction="row" justifyContent="left" spacing={2} mt={3}>
        {/* <CustomSocialButton>
        <Avatar
          src={icon1}
          alt={icon1}
          sx={{
            width: 16,
            height: 16,
            borderRadius: 0,
            mr: 1,
          }}
        />
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, whiteSpace: 'nowrap', mr: { sm: '3px' } }}>
          {title}{' '}
        </Box>{' '}
        Google
      </CustomSocialButton> */}
        <CustomSocialButton
          onClick={launchWhatsAppSignup}
          backgroundColor="#1877f238"
          fontWeight={600}
          style={{ border: 'none' }}
          sx={{
            '&:hover': {
              backgroundColor: 'none',
              boxShadow: 'none',
            },
          }}
        >
          <Avatar
            src={icon2}
            alt={icon2}
            sx={{
              width: 25,
              height: 25,
              borderRadius: 0,
              mr: 1,
            }}
          />
          <Box
            sx={{ display: { xs: 'none', sm: 'flex' }, whiteSpace: 'nowrap', mr: { sm: '3px' } }}
          >
            {title}{' '}
          </Box>{' '}
          Facebook
        </CustomSocialButton>
      </Stack>
    </>
  );
};

export default AuthSocialButtons;
