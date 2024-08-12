import React, { useEffect } from 'react';
// import icon1 from 'src/assets/images/svgs/google-icon.svg';
import icon2 from 'src/assets/images/svgs/facebook-icon.svg';
import CustomSocialButton from '../../../components/forms/theme-elements/CustomSocialButton';
import { Stack } from '@mui/system';
import { Avatar, Box } from '@mui/material';
import { useNavigate } from 'react-router';
import apiClient from 'src/api/axiosClient';
import toast from 'react-hot-toast'


const AuthSocialButtons = ({ title,setIsLoading }) => {
  const navigate = useNavigate();
 



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
          const fbAccessToken = response.authResponse.code;
          if (fbAccessToken) {
            console.log(fbAccessToken,"fbAccessToken")
            getAccessTokenForBusiness(fbAccessToken)
          }
          else {
            console.error("Access Token is not found")
          }
        } else {
          toast.error('User cancelled login or did not fully authorize.', { duration: 2000 });
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


 function getAccessTokenForBusiness(fbAccessToken){
  try {
    apiClient.get(`auth/get_access_token_for_business/?code=${fbAccessToken}`)
    .then((response) => {
      console.log(response,"verifyFbAccessToken response")
      if(response.data.status){
        setIsLoading(true)
        let verifyFbAccessToken = response.data.data.access_token
        console.log(verifyFbAccessToken,"verifyFbAccessToken")
        getBusinessId(verifyFbAccessToken)
      }
    }).catch((error)=>{
      console.error(error)
    })
  } catch (error) {
    
  }
 }
 
function getBusinessId(verifyFbAccessToken){
  try {
    apiClient.get(`auth/get_business_id?input_token=${verifyFbAccessToken}`, {
      headers: {
        'Access-Token': verifyFbAccessToken,
      }
    })
      .then((response) => {
        console.log(response,"response whatsappId")
        if(response.data.status){
          const whatsappId = response.data.data.data.granular_scopes.find(scopeObj => scopeObj.scope === "whatsapp_business_messaging");
           console.log(whatsappId,"whatsappId")
          getWhatsappBusinessMessaging(verifyFbAccessToken,whatsappId.target_ids[0])
        }
      })
      .catch((error) => {
        console.log(error)
      })
  } catch (error) {
    console.error(error,"error")
  }
}

  function getWhatsappBusinessMessaging(verifyFbAccessToken, whatsappId){
    try {
      apiClient.get(`auth/get_phone_id/${whatsappId}`, {
        headers: {
          'Access-Token': verifyFbAccessToken,
        }
      })
        .then((response) => {
          console.log(response,"respons phoneId ")
          if(response.data.status){
            const reqBody2 = {
              data : response.data.data,
              accessToken : verifyFbAccessToken
            }
            console.log(reqBody2,"reqBody2")
            localStorage.setItem("reqBody",JSON.stringify(reqBody2))
            const phoneId = response.data.data.id
            console.log(phoneId,"phoneId")
            updateUserFbInfo(verifyFbAccessToken,whatsappId,phoneId)

          }
        })
        .catch((error) => {
          console.log(error)
        })
    } catch (error) {
      console.error(error,"error")
    }
  }

 function updateUserFbInfo(accessToken,whatsappId,phoneId){
  try {
    let reqBody = {
      access_token : accessToken,
      phone_id :phoneId,
      whatsapp_business_account_id :whatsappId,
    }
    let userAccessToken = localStorage.getItem("access_app")
    apiClient.patch(`auth/update_user_fb_info/`,
      reqBody,{ headers: {'Access-Token': userAccessToken,}})
      .then((response)=>{
        if(response.data.status){
          toast.success('WABA successful! Please Verify Account', { duration: 2000 })
          window.location.reload()
        }
        console.log(response,"updateUserFbInfo")
      }).catch((error)=>{
        toast.error(error.toString(), { duration: 2000 });
        console.error(error)
      })
    
  } catch (error) {
    toast.error(error.toString(), { duration: 2000 });
     console.log(error)
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
