import React, { useEffect, useState } from 'react'
import {
  Grid, Card, Typography, Avatar, Button, IconButton, Box, Skeleton, Input,
  CircularProgress, TextField
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import PhoneIcon from '@mui/icons-material/Phone';
import MailIcon from '@mui/icons-material/Mail';
import HomeIcon from '@mui/icons-material/Home';
import { IconEdit } from '@tabler/icons';
import { Cancel, CameraAlt } from '@mui/icons-material';
import { Edit, Search } from '@mui/icons-material';
import createMetaAxiosInstance from 'src/api/axiosClientMeta';
import SaveIcon from '@mui/icons-material/Save';
import apiClient from 'src/api/axiosClient';
import { LoadingButton } from '@mui/lab';

function BusinessProfile() {
  const [contactName, setContactName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profileDetails, setProfileDetails] = useState({});
  const [editableProfile, setEditableProfile] = useState({});
  console.log("editableProfile", editableProfile)
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  console.log("newProfilePicture", newProfilePicture)
  const [newProfilePictureURL, setNewProfilePictureURL] = useState(null);
  console.log("newProfilePictureURL", newProfilePictureURL)
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  console.log("isEditing", isEditing)
  const [uploadingImage, setUploadingImage] = useState(false);
  console.log("uploadingImage", uploadingImage)


  const fetchData = async () => {
    try {
      const metaClient = createMetaAxiosInstance();
      const phoneResponse = await metaClient.get('phone_numbers');
      const fetchedContactName = phoneResponse?.data?.data[0]?.verified_name || 'N/A';
      const fetchedPhoneNumber = phoneResponse?.data?.data[0]?.display_phone_number || 'N/A';

      setContactName(fetchedContactName);
      setPhoneNumber(fetchedPhoneNumber);

      const phoneId = localStorage.getItem('phone_id');
      const profileResponse = await metaClient.get(
        `https://graph.facebook.com/${phoneId}/whatsapp_business_profile`,
        {
          params: {
            fields: 'about,address,description,email,profile_picture_url,websites,vertical',
          },
        },
      );

      const profileData = profileResponse?.data?.data[0] || {};
      setProfileDetails(profileData);
      setEditableProfile(profileData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);


  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'websites') {
      setEditableProfile((prev) => ({
        ...prev,
        [name]: value.split(',').map((url) => url.trim()),
      }));
    } else {
      setEditableProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadingImage(true);
      try {
        const sessionResponse = await apiClient.post(
          `/api/create_session_facebook/?file_length=${file.size}&file_type=${file.type}`,
        );

        if (sessionResponse && sessionResponse.data.id) {
          let mediaFile = new FormData();
          mediaFile.append('file', file);

          const uploadResponse = await apiClient.post(
            `/api/upload_file_facebook/${sessionResponse.data.id}`,
            mediaFile,
            {
              headers: { 'Content-Type': 'multipart/form-data' },
            },
          );

          if (uploadResponse && uploadResponse.data.res && uploadResponse.data.res.h) {
            const profilePictureHandle = uploadResponse.data.res.h;
            const imageUrl = URL.createObjectURL(file);
            setNewProfilePicture(profilePictureHandle);
            setNewProfilePictureURL(imageUrl);
          } else {
            console.error('Image upload failed:', uploadResponse.data.message);
          }
        } else {
          console.error('Failed to create session.');
        }
      } catch (error) {
        console.error(
          'Error uploading file:',
          error.response ? error.response.data : error.message,
        );
      } finally {
        setUploadingImage(false);
      }
    }
  };


  const handleSave = async () => {
    try {
      setLoading(true);
      const metaClient = createMetaAxiosInstance();
      const phoneId = localStorage.getItem('phone_id');
      let profilePictureHandle = profileDetails.profile_picture_handle;

      if (newProfilePicture) {
        profilePictureHandle = newProfilePicture;
      }

      const dataToUpdate = {
        ...editableProfile,
        profile_picture_handle: profilePictureHandle,
      };

      await metaClient.post(
        `https://graph.facebook.com/${phoneId}/whatsapp_business_profile`,
        dataToUpdate,
      );

      setProfileDetails((prev) => ({
        ...prev,
        ...dataToUpdate,
        profile_picture_url: newProfilePictureURL || prev.profile_picture_url,
      }));

      setIsEditing(false);
      setNewProfilePicture(null);
      setNewProfilePictureURL(null);
    } catch (error) {
      console.error('Failed to save data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

      {loading ? (
        <Box>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={300}
            sx={{ mt: 2 }}
            animation="wave"
          />
        </Box>) :
        <>
          <Card sx={{ margin: 'auto', padding: 6 }}>
            <Grid container spacing={2}>
              {/* Profile Picture */}
              <Grid item xs={12} sm={4} sx={{ position: 'relative', }}>
                <Avatar
                  src={newProfilePictureURL || profileDetails?.profile_picture_url}
                  alt="profile"
                  sx={{ width: '90%', height: 'auto', borderRadius: '50%' }}
                />
                {isEditing && (
                  <IconButton
                    component="label"
                    sx={{
                      position: 'absolute',
                      top: "10px",
                      right: "10px",
                      bgcolor: '#7ab95d29',
                      borderRadius: '50%',
                    }}
                  >
                    <CameraAlt style={{ color: 'green' }} />
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      sx={{ display: 'none' }}
                    />
                  </IconButton>
                )}
                {uploadingImage && (
                  <CircularProgress
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      marginTop: '-20px',
                      marginLeft: '-20px',
                    }}
                  />
                )}
              </Grid>

              {/* Profile Details */}
              <Grid item xs={12} sm={7}>
                <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: "30px" }}>
                  <Typography variant="h4" fontWeight="bold">{contactName}</Typography>
                  <Typography variant="subtitle1" color="textSecondary">{phoneNumber}</Typography>
                </Box>
                {
                  isEditing ? <>
                    <div style={{ display: 'flex', gap: '22px' }} >
                      <TextField
                        name="messaging_product"
                        label="Messaging Product"
                        value={editableProfile.messaging_product || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        sx={{
                          backgroundColor: '#ffffff73',
                          borderRadius: '6px',
                        }}
                        disabled
                      />
                      <TextField
                        name="vertical"
                        label="Vertical"
                        value={editableProfile.vertical || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        sx={{
                          backgroundColor: '#ffffff73',
                          borderRadius: '6px',
                        }}
                        disabled
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '22px' }}>
                      <TextField
                        name="email"
                        label="Email"
                        value={editableProfile.email || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        sx={{
                          backgroundColor: '#ffffff73',
                          borderRadius: '6px',
                        }}
                        autoFocus
                      />
                      <TextField
                        name="websites"
                        label="Websites"
                        value={editableProfile.websites?.join(', ') || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        sx={{
                          backgroundColor: '#ffffff73',
                          borderRadius: '6px',
                        }}
                      />
                    </div>
                    <div></div>
                    <div style={{ display: 'flex', gap: '22px' }}>
                    </div>
                    <TextField
                      name="address"
                      label="Address"
                      value={editableProfile.address || ''}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                      sx={{
                        backgroundColor: '#ffffff73',
                        borderRadius: '6px',
                      }}
                    />
                    <TextField
                      name="description"
                      label="Description"
                      value={editableProfile.description || ''}
                      onChange={handleChange}
                      rows={2}
                      multiline
                      margin="normal"
                      fullWidth
                      sx={{
                        backgroundColor: '#ffffff73',
                        borderRadius: '6px',
                      }}
                    />
                    <TextField
                      name="about"
                      label="About"
                      value={editableProfile.about || ''}
                      onChange={handleChange}
                      rows={2}
                      multiline
                      margin="normal"
                      fullWidth
                      sx={{
                        backgroundColor: '#ffffff73',
                        borderRadius: '6px',
                      }}
                    />

                    {isEditing && (
                      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                        <LoadingButton
                          variant="contained"
                          color="primary"
                          onClick={handleSave}
                          startIcon={<SaveIcon />}
                          loadingPosition="start"
                          type="submit"
                          loading={loading}
                        >
                          Save
                        </LoadingButton>
                      </Box>)}
                  </> :
                    <>
                      {profileDetails?.messaging_product && <Box sx={{ display: 'flex', flexDirection: 'row', margin: "5px 0px" }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ width: "30%" }}>Messaging Product :</Typography>
                        <Typography variant="subtitle1" color="textSecondary">{profileDetails?.messaging_product}</Typography>
                      </Box>
                      }
                      {
                        profileDetails?.vertical && <Box sx={{ display: 'flex', flexDirection: 'row', margin: "5px 0px" }}>
                          <Typography variant="h6" fontWeight="bold" sx={{ width: "30%" }}>Business Industry:</Typography>
                          <Typography variant="subtitle1" color="textSecondary">{profileDetails?.vertical}</Typography>
                        </Box>
                      }
                      {
                        profileDetails?.email && <Box sx={{ display: 'flex', flexDirection: 'row', margin: "5px 0px" }}>
                          <Typography variant="h6" fontWeight="bold" sx={{ width: "30%" }}>Email:</Typography>
                          <Typography variant="subtitle1" color="textSecondary">{profileDetails?.email}</Typography>
                        </Box>
                      }
                      {
                        profileDetails?.websites && <Box sx={{ display: 'flex', flexDirection: 'row', margin: "5px 0px" }}>
                          <Typography variant="h6" fontWeight="bold" sx={{ width: "30%" }}>Websites:</Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', }}>
                            {profileDetails?.websites && profileDetails?.websites.length > 0 && profileDetails?.websites.map(function (website, index) {
                              return <div key={index}><Typography variant="subtitle1" color="textSecondary">{index + 1}. {website}</Typography></div>
                            })}
                          </Box>
                        </Box>

                      }
                      {
                        profileDetails?.address && <Box sx={{ display: 'flex', flexDirection: 'row', margin: "5px 0px" }}>
                          <Typography variant="h6" fontWeight="bold" sx={{ width: "30%" }}>Address:</Typography>
                          <Typography variant="subtitle1" color="textSecondary" sx={{ width: "70%" }}>{profileDetails?.address}</Typography>
                        </Box>
                      }
                      {
                        profileDetails?.description && <Box sx={{ display: 'flex', flexDirection: 'row', margin: "5px 0px" }}>
                          <Typography variant="h6" fontWeight="bold" sx={{ width: "30%" }}>Description:</Typography>
                          <Typography variant="subtitle1" color="textSecondary">{profileDetails?.description}</Typography>
                        </Box>
                      }
                      {
                        profileDetails?.about && <Box sx={{ display: 'flex', flexDirection: 'row', margin: "5px 0px" }}>
                          <Typography variant="h6" fontWeight="bold" sx={{ width: "30%" }}>About:</Typography>
                          <Typography variant="subtitle1" color="textSecondary">{profileDetails?.about}</Typography>
                        </Box>
                      }
                    </>

                }
              </Grid>
              <Grid item xs={12} sm={1}>
                <IconButton onClick={handleEditToggle}>
                  {isEditing ? <Cancel color="error" /> : <IconEdit style={{ color: 'green' }} />}
                </IconButton>
              </Grid>
            </Grid>
          </Card>
        </>
      }
    </>
  )
}

export default BusinessProfile