import React, { useEffect, useState } from 'react';
import {
  Avatar,
  FormControl,
  OutlinedInput,
  Typography,
  Grid,
  Stack,
  Box,
  Button,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Card,
  Tooltip,
} from '@mui/material';
import { Edit, Cancel, Delete } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import PageContainer from '../../../components/container/PageContainer';
import apiClient from 'src/api/axiosClient';
import Spinner from 'src/views/spinner/Spinner';

import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import toast from 'react-hot-toast';
import { useUser } from 'src/store/apps/UserContext';
import defaultProfilePic from 'src/assets/images/backgrounds/download.png';
// import defaultProfilePic from 'src/assets/images/backgrounds/default_image.png';

const DeleteDialog = ({ open, handleClose, handleDelete, deleteDialogLoading }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      // sx={{ position: 'absolute', top: '-400px'}}
      sx={{ height: '30%' }}
    >
      <DialogTitle id="alert-dialog-title">Delete Confirmation</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete this profile picture?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleDelete}
          color="error"
          disabled={deleteDialogLoading}
          variant="contained"
        >
          {deleteDialogLoading ? <CircularProgress size={24} /> : 'Delete'}
        </Button>
        <Button onClick={handleClose} color="primary" variant="contained">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const UserProfile = () => {
  const [userData, setUserData] = useState({
    display_name: '',
    profile_pic: '',
    whatsApp_number: '',
    user_email: '',
    full_name: '',
  });
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editPicMode, setEditPicMode] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteDialogLoading, setDeleteDialogLoading] = useState(false);
  const { user, setUser } = useUser();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setEditMode(queryParams.get('edit') === 'true');
    fetchUserProfile();
  }, [location.search]);

  useEffect(() => {
    setUserData(user); // Initialize userData with context user
  }, [user]);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/auth/user_profile/');
      // console.log('API Response:', response);
      if (response.status === 200) {
        const userProfileData = response.data.data;
        const profilePic = userProfileData.profile_pic || defaultProfilePic;
        setUserData({ ...userProfileData, profile_pic: profilePic });

        setUser({ ...userProfileData, profile_pic: profilePic });
      }
    } catch (error) {
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setEditMode(true);
    navigate('?edit=true');
  };

  const handleCancelClick = () => {
    setEditMode(false);
    navigate('/user-profile');
  };

  const handleSaveClick = async () => {
    const formData = new FormData();
    formData.append('display_name', userData.display_name);
    formData.append('whatsApp_number', userData.whatsApp_number);
    formData.append('user_email', userData.user_email);
    formData.append('full_name', userData.full_name);

    try {
      setButtonLoading(true);
      const response = await apiClient.patch('/auth/user_profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        setEditMode(false);
        toast.success('Profile updated successfully');
        fetchUserProfile();
        navigate('/user-profile');
      }
    } catch (error) {
      console.error('There was an error updating the user data!', error);
      setError('Failed to update user data');
    } finally {
      setButtonLoading(false);
    }
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('profile_pic', file);

    setUploadingImage(true);

    try {
      const response = await apiClient.patch('/auth/user_profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        setUserData((prevState) => ({
          ...prevState,
          profile_pic: URL.createObjectURL(file),
        }));
        setUser((prevState) => ({
          ...prevState,
          profile_pic: URL.createObjectURL(file),
        }));
        setEditPicMode(false);
        toast.success('Profile picture updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update profile picture');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCancelProfilePicChange = () => {
    setEditPicMode(false);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUserData({ ...userData, [id]: value });
  };

  const handleRemovePicture = () => {
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    setDeleteDialogLoading(true);
    try {
      // Perform deletion logic here
      await apiClient.patch('/auth/user_profile/', {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        profile_pic: null,
      });
      setUserData((prevState) => ({
        ...prevState,
        profile_pic: defaultProfilePic,
      }));
      toast.success('Profile picture removed');
      fetchUserProfile();
    } catch (error) {
      console.error('Failed to remove profile picture', error);
      toast.error('Failed to remove profile picture');
    } finally {
      setDeleteDialogLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <PageContainer title="User Profile" description="This is User Profile page">
      <div style={{ justifyContent: 'center', display: 'flex' }}>
        <Card
          sx={{
            maxWidth: 650,
            margin: 'auto',
            mt: 1,
            paddingBottom: '6px !important',
            padding: 4,
            boxShadow: 3,
            paddingTop: '6px',
          }}
        >
          <Typography variant="h4" color="primary">
            Your Profile{' '}
          </Typography>

          <Grid container spacing={4} direction="column" alignItems="center">
            <Grid item>
              <Box position="relative">
                <Avatar
                  src={userData.profile_pic || defaultProfilePic}
                  sx={{
                    width: 135,
                    height: 135,
                    bgcolor: 'primary.main',
                    border: '3px solid rgb(207, 213, 213)',
                  }}
                >
                  {!userData.profile_pic && userData?.full_name?.charAt(0)}
                </Avatar>
                {uploadingImage && (
                  <CircularProgress
                    size={50}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      mt: '-25px',
                      ml: '-25px',
                      zIndex: 1,
                    }}
                  />
                )}
                {editPicMode ? (
                  <>
                    <Tooltip title="Add Photo">
                      <IconButton
                        component="label"
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          bgcolor: '#1A4D2E',
                          padding: '5px',
                          color: 'white !important',
                          '&:hover': {
                            bgcolor: '#1A4D2E',
                            color: 'white',
                          },
                        }}
                      >
                        <input type="file" hidden onChange={handleProfilePicChange} />
                        <AddPhotoAlternateIcon sx={{ width: '20px', height: '20px' }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Close">
                      <IconButton
                        color="error"
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          bgcolor: '#de3838',
                          padding: '5px',
                          color: 'white !important',
                          '&:hover': {
                            bgcolor: '#de3838',
                            color: 'white',
                          },
                        }}
                        onClick={handleCancelProfilePicChange}
                      >
                        <Cancel sx={{ width: '20px', height: '20px' }} />
                      </IconButton>
                    </Tooltip>
                  </>
                ) : (
                  <>
                    <Tooltip title="Edit Photo">
                      <IconButton
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          bgcolor: '#1A4D2E',
                          padding: '5px',
                          color: 'white !important',
                          '&:hover': {
                            bgcolor: '#1A4D2E',
                            color: 'white',
                          },
                        }}
                        onClick={() => setEditPicMode(true)}
                      >
                        <Edit sx={{ width: '20px', height: '20px' }} />
                      </IconButton>
                    </Tooltip>
                    {userData.profile_pic !== defaultProfilePic && (
                      <Tooltip title="Delete Photo">
                        <IconButton
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            bgcolor: '#de3838',
                            padding: '5px',
                            color: 'white !important',
                            '&:hover': {
                              bgcolor: '#de3838',
                              color: 'white',
                            },
                          }}
                          onClick={handleRemovePicture}
                        >
                          <Delete sx={{ width: '20px', height: '20px' }} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </>
                )}
              </Box>
            </Grid>

            <Grid item width="100%" paddingTop="0px !important">
              <FormControl fullWidth margin="normal" sx={{ marginTop: '6px' }}>
                <Typography variant="h6" gutterBottom fontWeight={500}>
                  Display Name
                </Typography>
                <OutlinedInput
                  id="display_name"
                  value={userData.display_name}
                  onChange={handleChange}
                  readOnly={!editMode}
                  sx={{
                    backgroundColor: editMode ? '#ffffffad' : 'none',
                    // padding: '10.5px 14px',
                    boxShadow: editMode ? ' ' : '0px 1px 3px rgba(0, 0, 0, 0.1)',
                    '& .MuiInputBase-input': {
                      padding: '10.5px 14px',
                    },
                  }}
                  autoFocus={editMode}
                  placeholder="Enter display name"
                />
              </FormControl>

              <FormControl fullWidth margin="normal" sx={{ marginTop: '4px' }}>
                <Typography variant="h6" gutterBottom fontWeight={500}>
                  Full Name
                </Typography>
                <OutlinedInput
                  id="full_name"
                  value={userData.full_name}
                  onChange={handleChange}
                  readOnly={!editMode}
                  placeholder="Enter full name"
                  sx={{
                    boxShadow: editMode ? ' ' : '0px 1px 3px rgba(0, 0, 0, 0.1)',
                    backgroundColor: editMode ? '#ffffffad' : 'none',
                    border: editMode ? '1px solid #1A4D2E' : 'none',
                    '& .MuiInputBase-input': {
                      padding: '10.5px 14px',
                    },
                  }}
                />
              </FormControl>

              <FormControl fullWidth margin="normal" sx={{ marginTop: '4px' }}>
                <Typography variant="h6" gutterBottom fontWeight={500}>
                  Email
                </Typography>
                <OutlinedInput
                  id="user_email"
                  value={userData.user_email}
                  disabled={editMode}
                  readOnly={!editMode}
                  placeholder="Enter email"
                  sx={{
                    boxShadow: editMode ? ' ' : '0px 1px 3px rgba(0, 0, 0, 0.1)',
                    '& .MuiInputBase-input': {
                      padding: '10.5px 14px',
                    },
                  }}
                />
              </FormControl>

              <FormControl fullWidth margin="normal" sx={{ marginTop: '4px' }}>
                <Typography variant="h6" gutterBottom fontWeight={500}>
                  WhatsApp Number
                </Typography>
                <OutlinedInput
                  id="whatsApp_number"
                  value={userData.whatsApp_number || ''}
                  // onChange={handleChange}
                  disabled={editMode}
                  readOnly={!editMode}
                  placeholder="Enter WhatsApp number"
                  sx={{
                    boxShadow: editMode ? ' ' : '0px 1px 3px rgba(0, 0, 0, 0.1)',
                    '& .MuiInputBase-input': {
                      padding: '10.5px 14px',
                    },
                  }}
                />
              </FormControl>

              {editMode ? (
                <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveClick}
                    disabled={buttonLoading}
                    startIcon={
                      buttonLoading ? <CircularProgress size={20} color="inherit" /> : null
                    }
                  >
                    {buttonLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button variant="contained" color="error" onClick={handleCancelClick}>
                    Cancel
                  </Button>
                </Stack>
              ) : (
                <Stack direction="row" justifyContent="center" mt={2}>
                  <Button variant="contained" color="primary" onClick={handleEditClick}>
                    Edit Profile
                  </Button>
                </Stack>
              )}
            </Grid>
          </Grid>
        </Card>
      </div>
      <DeleteDialog
        open={deleteDialogOpen}
        handleClose={handleCloseDeleteDialog}
        handleDelete={handleConfirmDelete}
        deleteDialogLoading={deleteDialogLoading}
      />
    </PageContainer>
  );
};

export default UserProfile;
