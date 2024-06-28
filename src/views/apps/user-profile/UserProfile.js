import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Link,
  FormControl,
  OutlinedInput,
  Typography,
  Grid,
  Stack,
  Box,
  Button,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import PageContainer from '../../../components/container/PageContainer';
import apiClient from 'src/api/axiosClient';
import Spinner from 'src/views/spinner/Spinner';

const UserProfile = () => {
  const [userData, setUserData] = useState({
    display_name: '',
    profile_pic: '',
    whatsApp_number: '',
    user_email: '',
    user_full_name: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setEditMode(queryParams.get('edit') === 'true');
    fetchUserProfile();
  }, [location.search]);

  const fetchUserProfile = async () => {
    try {
      const response = await apiClient.get('/auth/user_profile/');
      console.log('API Response:', response);
      if (response.status === 200) {
        setUserData(response.data.data);
      }
    } catch (error) {
      console.error('There was an error fetching the user data!', error);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setEditMode(true);
    navigate('?edit=true');
  };

  const handleSaveClick = async () => {
    const formData = new FormData();
    formData.append('display_name', userData.display_name);
    formData.append('whatsApp_number', userData.whatsApp_number);
    formData.append('user_email', userData.user_email);
    formData.append('user_full_name', userData.user_full_name);
    // if (userData.profile_pic instanceof File) {
    // formData.append('profile_pic', userData.profile_pic);
    // }
    console.log('===========', userData);
    try {
      const response = await apiClient.patch('/auth/user_profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        setUserData(response.data.data);
        setEditMode(false);
        navigate('/user-profile');
      }
    } catch (error) {
      console.error('There was an error updating the user data!', error);
      setError('Failed to update user data');
    }
  };

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    if (id === 'profile_pic') {
      setUserData({ ...userData, [id]: files[0] });
    } else {
      setUserData({ ...userData, [id]: value });
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <PageContainer title="User Profile" description="This is User Profile page">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
        }}
      >
        <Grid container spacing={2} sx={{ width: '60%', alignItems: 'center' }}>
          <Grid item xs={12} md={3}>
            <Avatar
              src={userData.profile_pic}
              sx={{
                width: 100,
                height: 100,
                backgroundColor: 'primary.main',
                marginBottom: 2,
              }}
            >
              {(!userData.profile_pic || userData.profile_pic === '') && userData.user_full_name
                ? userData.user_full_name.charAt(0)
                : ''}
            </Avatar>
            {/* <Link
              sx={{
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: 500,
                marginLeft: '2rem',
                textDecoration: 'none',
              }}
              onClick={handleEditClick}
            >
              Edit
            </Link> */}
          </Grid>

          <Grid item xs={12} md={9}>
            <Stack sx={{ flexDirection: 'column' }}>
              <FormControl sx={{ mt: 2 }}>
                <Typography>Display Name</Typography>
                <OutlinedInput
                  id="display_name"
                  value={userData.display_name}
                  fullWidth
                  readOnly={!editMode}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl sx={{ mt: 2 }}>
                <Typography>Full Name</Typography>
                <OutlinedInput
                  id="user_full_name"
                  value={userData.user_full_name}
                  fullWidth
                  readOnly={!editMode}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl sx={{ mt: 2 }}>
                <Typography>Email</Typography>
                <OutlinedInput
                  id="user_email"
                  value={userData.user_email}
                  fullWidth
                  readOnly
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl sx={{ mt: 2 }}>
                <Typography>Whatsapp Number</Typography>
                <OutlinedInput
                  id="whatsApp_number"
                  value={userData.whatsApp_number || ''}
                  fullWidth
                  readOnly={!editMode}
                  onChange={handleChange}
                />
              </FormControl>
              {/* {editMode && (
                <FormControl sx={{ mt: 2 }}>
                  <Typography>Profile Picture</Typography>
                  <OutlinedInput type="file" id="profile_pic" fullWidth onChange={handleChange} />
                </FormControl>
              )} */}
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2, width: '30%' }}
                onClick={handleEditClick}
              >
                Edit
              </Button>
              {editMode && (
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={handleSaveClick}
                >
                  Save
                </Button>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default UserProfile;
