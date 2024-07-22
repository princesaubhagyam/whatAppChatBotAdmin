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
} from '@mui/material';
import { Edit, Cancel, Delete } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import PageContainer from '../../../components/container/PageContainer';
import apiClient from 'src/api/axiosClient';
import Spinner from 'src/views/spinner/Spinner';
import { IconEdit } from '@tabler/icons';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import toast from 'react-hot-toast';
import { LoadingButton } from '@mui/lab';
import defaultProfilePic from 'src/assets/images/backgrounds/download.png';

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
        
        <Button onClick={handleDelete} color="error" disabled={deleteDialogLoading} variant='contained'>
          {deleteDialogLoading ? <CircularProgress size={24} /> : 'Delete'}
        </Button>
        <Button onClick={handleClose} color="primary" variant='contained'>
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
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editPicMode, setEditPicMode] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteDialogLoading, setDeleteDialogLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setEditMode(queryParams.get('edit') === 'true');
    fetchUserProfile();
  }, [location.search]);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/auth/user_profile/');
      console.log('API Response:', response);
      if (response.status === 200) {
        const userProfileData = response.data.data;
        const profilePic = userProfileData.profile_pic || defaultProfilePic;
        setUserData({ ...userProfileData, profile_pic: profilePic });
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
        setEditPicMode(false);
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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
        }}
      >
        <Grid container spacing={7} sx={{ width: '60%', alignItems: 'center' }}>
          <Grid item xs={12} md={3} sx={{ position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'end' }}>
              <Avatar
                src={userData.profile_pic || defaultProfilePic}
                sx={{
                  width: 150,
                  height: 150,
                  backgroundColor: 'primary.main',
                  marginBottom: 2,
                  border: '3px solid #cfd5d5',
                }}
              >
                {!userData.profile_pic &&
                  (userData?.full_name ? userData?.full_name.charAt(0) : '')}
              </Avatar>
              {editPicMode ? (
                <>
                  <IconButton
                    color="primary"
                    component="label"
                    sx={{ position: 'absolute', top: '43px', right: 0 }}
                  >
                    <input type="file" id="profile_pic" hidden onChange={handleProfilePicChange} />
                    <AddPhotoAlternateIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    sx={{ position: 'absolute', bottom: 0, right: 0 }}
                    onClick={handleCancelProfilePicChange}
                  >
                    <Cancel />
                  </IconButton>
                </>
              ) : (
                <>
                  {userData.profile_pic !== defaultProfilePic && (
                    <IconButton
                      color="error"
                      sx={{ position: 'absolute', top: '43px', right: '0' }}
                      onClick={handleRemovePicture}
                    >
                      <Delete />
                    </IconButton>
                  )}
                  <IconButton
                    color="primary"
                    sx={{ position: 'absolute', bottom: 0, right: 0 }}
                    onClick={() => setEditPicMode(true)}
                  >
                    <IconEdit />
                  </IconButton>
                </>
              )}
              {uploadingImage && (
                <CircularProgress
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                  }}
                />
              )}
            </div>
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
                  sx={{
                    backgroundColor: editMode ? '#ffffffad' : 'none',
                  }}
                  autoFocus={editMode ? 'true' : 'false'}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl sx={{ mt: 2 }}>
                <Typography>Full Name</Typography>
                <OutlinedInput
                  id="full_name"
                  value={userData.full_name}
                  fullWidth
                  readOnly={!editMode}
                  sx={{
                    backgroundColor: editMode ? '#ffffffad' : 'none',
                    border: editMode ? '1px solid #1A4D2E' : 'none',
                  }}
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
                  readOnly
                  onChange={handleChange}
                />
              </FormControl>
              {!editMode && (
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2, width: '30%' }}
                  onClick={handleEditClick}
                >
                  Update Profile
                </Button>
              )}
              {editMode && (
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <LoadingButton
                    variant="contained"
                    color="primary"
                    onClick={handleSaveClick}
                    loadingPosition="start"
                    loading={loading}
                  >
                    Update
                  </LoadingButton>
                  <Button variant="contained" color="error" onClick={handleCancelClick}>
                    Cancel
                  </Button>
                </Stack>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Box>
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
