import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  Stack,
  InputAdornment,
  OutlinedInput,
  FormHelperText,
  Select,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { IconLock, IconMail, IconPhone, IconUser,IconHome } from '@tabler/icons';
import { IconHomeLink, IconBuildingSkyscraper, IconBuildingEstate, IconBuildingCottage, IconMapPinCode } from '@tabler/icons-react';
import toast from 'react-hot-toast';
import { LoadingButton } from '@mui/lab';
import apiClient from 'src/api/axiosClient';
import countryCodes from 'src/utils/Countrycode.json';
import indanstate from "src/utils/IndianState.json"
import countryList from "src/utils/CountryList.json"
console.log(indanstate, "indanstate")
console.log(countryList, "indanstate")

const AuthRegister = ({ title, subtitle, subtext }) => {
  const initCredentials = {
    full_name: '',
    email: '',
    mobile: '',
    password: '',
    confirm_password: '',
    // address_line: '',
    // city: '',
    // postal_code: ''
  };
  const navigate = useNavigate();

  const [credentials, setCredentials] = React.useState(initCredentials);
  const [loading, setLoading] = React.useState(false);
  const [countryCode, setCountryCode] = useState('+91');
  const [myCountry, setMyCountry] = useState("India")
  const [myState, setMyState] = useState("Gujarat")
  const [errors, setErrors] = React.useState({});
  console.log(errors, "errors")

  // const countryCodes = [
  //   { value: '+91', label: 'India (+91)' },
  //   { value: '+1', label: 'USA (+1)' },
  //   { value: '+44', label: 'UK (+44)' },
  //   // Add more country codes as needed
  // ];

  const signUpAPICall = async (creds) => {
    try {
      const temp = { ...creds, mobile: (countryCode + creds.mobile).replace('+', ''), state: myState, country: myCountry };
      // const temp = { ...creds, mobile: (countryCode + creds.mobile).replace('+', '') };
      const res = await apiClient.post('/auth/signup/', { ...temp });
      if (res.status === 201) {
        navigate('/auth/login');
        toast.success('Sign up successful!');
      }
    } catch (error) {
      if (error?.response?.data?.status === false) {
        toast.error(error.response.data.message, { duration: 2000 });
      } else {
        toast.error(error.toString());
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    if (validateForm()) {
      setLoading(true);
      if (!credentials.password.length || !credentials.confirm_password.length) {
        toast.error('Please enter password!');
        setLoading(false);
      } else if (credentials.password !== credentials.confirm_password) {
        toast.error('Passwords do not match!');
        setLoading(false);
      } else {
        signUpAPICall(credentials);
      }
    }
  };

  const handleFieldChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleCountryCodeChange = (e) => {
    setCountryCode(e.target.value);
  };

  const handleCountryNameChange = (e) => {
    setMyCountry(e.target.value)
  }

  const handleStateNameChange = (e) => {
    setMyState(e.target.value)
  }


  const validateForm = () => {
    let isValid = true;
    const errors = {};

    if (!credentials.full_name) {
      errors.full_name = 'Please enter your full name';
      isValid = false;
    }

    if (!credentials.email) {
      errors.email = 'Please enter your email';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      errors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (!credentials.mobile) {
      errors.mobile = 'Please enter your mobile number';
      isValid = false;
    } else if (!/^\+?[0-9]{10,14}$/.test(credentials.mobile)) {
      errors.mobile = 'Please enter a valid mobile number';
      isValid = false;
    }

    if (!credentials.password) {
      errors.password = 'Please enter your password';
      isValid = false;
    }

    if (!credentials.confirm_password) {
      errors.confirm_password = 'Please confirm your password';
      isValid = false;
    } else if (credentials.password !== credentials.confirm_password) {
      errors.confirm_password = 'Passwords do not match';
      isValid = false;
    }

    // if (!credentials.address_line) {
    //   errors.address_line = 'Please enter your address';
    //   isValid = false;
    // }
    // if (!credentials.city) {
    //   errors.city = 'Please enter your city name';
    //   isValid = false;
    // }
    // if (!credentials.postal_code) {
    //   errors.postal_code = 'Please enter your zip code';
    //   isValid = false;
    // }

    setErrors(errors);
    return isValid;
  };

  return (
    <>
      {title && (
        <Typography fontWeight="700" variant="h3" mb={1}>
          {title}
        </Typography>
      )}

      {subtext}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSignUp();
        }}
      >
        <Stack spacing={2}>
          <FormControl fullWidth error={!!errors.full_name}>
            <OutlinedInput
              startAdornment={
                <InputAdornment position="start">
                  <IconUser width={20} color="dimgray" />
                </InputAdornment>
              }
              placeholder="Enter Full Name"
              fullWidth
              name="full_name"
              onChange={handleFieldChange}
            />
            {errors.full_name && <FormHelperText error>{errors.full_name}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth error={!!errors.email}>
            <OutlinedInput
              startAdornment={
                <InputAdornment position="start">
                  <IconMail width={20} color="dimgray" />
                </InputAdornment>
              }
              placeholder="Enter Email"
              fullWidth
              name="email"
              onChange={handleFieldChange}
            />
            {errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth error={!!errors.mobile}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Select
                value={countryCode}
                onChange={handleCountryCodeChange}
                sx={{ width: 'auto', minWidth: '100px' }}
              >
                {countryCodes.map((code) => (
                  <MenuItem key={code.dial_code} value={code.dial_code}>
                    {code.code} {code.dial_code}
                  </MenuItem>
                ))}
              </Select>
              <OutlinedInput
                startAdornment={
                  <InputAdornment position="start">
                    <IconPhone width={20} color="dimgray" />
                  </InputAdornment>
                }
                placeholder="Enter Mobile Number"
                fullWidth
                name="mobile"
                value={credentials.mobile}
                onChange={handleFieldChange}
              />
            </Stack>
            {errors.mobile && <FormHelperText error>{errors.mobile}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth error={!!errors.password}>
            <OutlinedInput
              type="password"
              startAdornment={
                <InputAdornment position="start">
                  <IconLock width={20} color="dimgray" />
                </InputAdornment>
              }
              placeholder="Enter Password"
              fullWidth
              name="password"
              onChange={handleFieldChange}
            />
            {errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth error={!!errors.confirm_password}>
            <OutlinedInput
              type="password"
              startAdornment={
                <InputAdornment position="start">
                  <IconLock width={20} color="dimgray" />
                </InputAdornment>
              }
              placeholder="Enter Confirm Password"
              fullWidth
              name="confirm_password"
              onChange={handleFieldChange}
            />
            {errors.confirm_password && (
              <FormHelperText error>{errors.confirm_password}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth error={!!errors.address_line}
          >
            <OutlinedInput
              type="text"
              startAdornment={
                <InputAdornment position="start">
                  <IconHome width={20} color="dimgray" />
                </InputAdornment>
              }
              placeholder="Enter Your Address"
              fullWidth
              name="address_line"
              onChange={handleFieldChange}
            />
            {errors.address_line && (
              <FormHelperText error>{errors.address_line}</FormHelperText>
            )}
          </FormControl>
          <Box sx={{
            display: "flex"
          }}>
            <FormControl fullWidth error={!!errors.city}
              sx={{
                marginRight: "5px"
              }}
            >
              <OutlinedInput
                type="text"
                startAdornment={
                  <InputAdornment position="start">
                    <IconBuildingSkyscraper width={20} color="dimgray" />
                  </InputAdornment>
                }
                placeholder="Enter Your city"
                fullWidth
                name="city"
                onChange={handleFieldChange}
              />
              {errors.city && <FormHelperText error>{errors.city}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth
              sx={{
                marginLeft: "5px"
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', width: '100%' }}>

                  <IconBuildingEstate width={20} color="dimgray"
                    style={{
                      position: 'absolute',
                      left: '15px',
                      pointerEvents: 'none'
                    }}
                  />
                  <Select
                    value={myState}
                    onChange={handleStateNameChange}
                    sx={{ width: '100%', pl: '32px' }}
                  >
                    {indanstate.map((code) => (
                      <MenuItem key={code.key} value={code.name}>
                        {code.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              </Stack>
            </FormControl>
          </Box>
          <Box sx={{
            display: "flex",
            justifyContent: "space-between"
          }}>
            <FormControl fullWidth
              sx={{
                marginRight: "5px"
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', width: '100%' }}>
                  <IconBuildingCottage width={20} color="dimgray"
                    style={{
                      position: 'absolute',
                      left: '15px',
                      pointerEvents: 'none'
                    }}
                  />
                  <Select
                    value={myCountry}
                    onChange={handleCountryNameChange}
                    sx={{
                      width: '100%',
                      pl: '32px'

                    }}
                  >
                    {countryList.map((code) => (
                      <MenuItem key={code.code} value={code.name}>
                        {code.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              </Stack>
            </FormControl>
            <FormControl fullWidth error={!!errors.postal_code}
              sx={{
                marginLeft: "5px"
              }}
            >
              <OutlinedInput
                type="text"
                startAdornment={
                  <InputAdornment position="start">
                    <IconMapPinCode width={20} color="dimgray" />
                  </InputAdornment>
                }
                placeholder="Enter Your Zip Code"
                fullWidth
                name="postal_code"
                onChange={handleFieldChange}
              />
              {errors.postal_code && (
                <FormHelperText error>{errors.postal_code}</FormHelperText>
              )}
            </FormControl>
          </Box>
        </Stack>
        <Box mt={2}>
          <LoadingButton
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            onClick={handleSignUp}
            type="submit"
            loading={loading}
            loadingPosition="start"
          >
            Sign Up
          </LoadingButton>
        </Box>
        {subtitle}
      </form>
    </>
  );
};

export default AuthRegister;
