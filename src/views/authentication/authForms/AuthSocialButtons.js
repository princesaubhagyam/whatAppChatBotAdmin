import React, { useEffect } from 'react';
import icon1 from 'src/assets/images/svgs/google-icon.svg';
import icon2 from 'src/assets/images/svgs/facebook-icon.svg';
import CustomSocialButton from '../../../components/forms/theme-elements/CustomSocialButton';
import { Stack } from '@mui/system';
import { Avatar, Box } from '@mui/material';
import { useNavigate } from 'react-router';

const AuthSocialButtons = ({ title }) => {
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
          const accessToken = response.authResponse.accessToken;
          console.log(accessToken);
          fetch(
            `https://graph.facebook.com/v20.0/debug_token?input_token=${accessToken}&access_token=EABN2cqTjBrsBO2u9dXpmCjDBuIQpOZBe0sZCCGsEIvBUdP4SJ6nKKU60Qo4TA6FBaFNAZCeJCASzRYapk5y52aEQp833n1LpPjSHNvdBsoqME7EVsXO6BqZBsFmA3gvVb8NvQSkkz60PRKFTE01Ox3okM9Oy71yhXUKExbpwIAWPYY6NqCmWLDbRlw9ZCkZCZAkAd1tvB0jhTX9BY537cIjIlT87CC1oNgeQZCCBhP1gQGsO`,
          )
            .then((response) => response.json())
            .then((data) => {
              console.log(data);
              if (data.data && data.data.is_valid) {
                navigate('/dashboard');
              } else {
                navigate('/auth/login');
              }
            })
            .catch((error) => {
              console.error('Error fetching debug token:', error);
              navigate('/auth/login');
            });
        } else {
          console.log('User cancelled login or did not fully authorize.');
          navigate('/auth/login');
        }
      },
      {
        config_id: '995842362049849',
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

  return (
    <>
      <Stack direction="row" justifyContent="center" spacing={2} mt={3}>
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
