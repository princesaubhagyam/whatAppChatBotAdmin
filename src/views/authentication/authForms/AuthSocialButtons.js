import React, { useEffect } from 'react';
// import icon1 from 'src/assets/images/svgs/google-icon.svg';
import icon2 from 'src/assets/images/svgs/facebook-icon.svg';
import CustomSocialButton from '../../../components/forms/theme-elements/CustomSocialButton';
import { Stack } from '@mui/system';
import { Avatar, Box } from '@mui/material';
import { useNavigate } from 'react-router';
import apiClient from 'src/api/axiosClient';
import toast from 'react-hot-toast'


const AuthSocialButtons = ({ title,  setIsLoading }) => {
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
            getAccessTokenForBusiness(fbAccessToken)
          }
          else {
            toast.error('Access Token is not found.', { duration: 2000 });
            console.error("Access Token is not found")
          }
        } else {
          toast.error('User cancelled login or did not fully authorize. Please go to Dashborad and click again on the Sign in with FB', { duration: 5000 });
          console.error('User cancelled login or did not fully authorize.');
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
      if(response.data.status){
        setIsLoading(true)
        let verifyFbAccessToken = response.data.data.access_token
        getBusinessId(verifyFbAccessToken)
      }
    }).catch((error)=>{
      toast.error(error.toString(), { duration: 2000 });
      console.error(error)
    })
  } catch (error) {
    toast.error(error.toString(), { duration: 2000 });
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
        if(response.data.status){
          const whatsappId = response.data.data.data.granular_scopes.find(scopeObj => scopeObj.scope === "whatsapp_business_messaging");
          getWhatsappBusinessMessaging(verifyFbAccessToken,whatsappId.target_ids[0])
        }
      })
      .catch((error) => {
        toast.error(error.toString(), { duration: 2000 });
        console.error(error)
      })
  } catch (error) {
    toast.error(error.toString(), { duration: 2000 });
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
          if(response.data.status){
            const phoneId = response.data.data.id
            updateUserFbInfo(verifyFbAccessToken,whatsappId,phoneId)

          }
        })
        .catch((error) => {
          toast.error(error.toString(), { duration: 2000 });
          console.error(error)
        })
    } catch (error) {
      toast.error(error.toString(), { duration: 2000 });
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
          addUserInfo()
          verifiedAccount(accessToken,phoneId)
        }
      }).catch((error)=>{
        toast.error(error.toString(), { duration: 2000 });
        console.error(error)
      })
    
  } catch (error) {
    toast.error(error.toString(), { duration: 2000 });
     console.error(error)
  }
 }

 function addUserInfo(){
    try {
      apiClient.get(`auth/user_profile/`)
      .then((response)=>{
        if(response.data.status) {
           if(response.data.data.facebook_meta_data){
            localStorage.setItem('graph_api_url', response.data.data.facebook_meta_data.graph_api_url);
            localStorage.setItem('api_version',response.data.data.facebook_meta_data.api_version);
            localStorage.setItem('app_id', response.data.data.facebook_meta_data.app_id);
            localStorage.setItem('embedded_configuration_id', response.data.data.facebook_meta_data.embedded_configuration_id);
            localStorage.setItem('phone_id', response.data.data.facebook_meta_data.phone_id);
            localStorage.setItem('whatsapp_business_account_id', response.data.data.facebook_meta_data.whatsapp_business_account_id);
            localStorage.setItem('access_meta',response.data.data.facebook_meta_data.access_token);
           }
        }
      }).catch((error)=>{
         console.error(error)
      })
    } catch (error) {
        console.error(error)  
    }
 }
 function verifiedAccount(accessToken,phoneId){
  try { 
    const reqBody ={pin : "123456" } 
    apiClient.post(`auth/registerphone/${phoneId}/`,reqBody,{
      headers: {
        'Access-Token': accessToken
      }}).then((response)=>{

        if(response.data.status){
          toast.success("WABA Successful !", { duration: 2000 });
          navigate('/' || "/home");
        }
      })
      .catch((error)=>{
        console.log(error,"error")
        toast.error(error.toString(), { duration: 2000 });
      })
  } catch (error) {
    console.log(error,"error")
    toast.error(error.toString(), { duration: 2000 });
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
