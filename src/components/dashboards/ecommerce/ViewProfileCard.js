import {
  CardContent,
  Card,
  Typography,
  Collapse,
  Box,
  IconButton,
  TextField,
  Avatar,
  Input,
  CircularProgress,
  Skeleton,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import createMetaAxiosInstance from 'src/api/axiosClientMeta';
import { IconEdit } from '@tabler/icons';
import SaveIcon from '@mui/icons-material/Save';
import { Cancel, CameraAlt } from '@mui/icons-material';
import apiClient from 'src/api/axiosClient';
import { LoadingButton } from '@mui/lab';

const ViewProfileCard = ({ isLoading }) => {
  const [contactName, setContactName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profileDetails, setProfileDetails] = useState({});
  const [editableProfile, setEditableProfile] = useState({});
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [newProfilePictureURL, setNewProfilePictureURL] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);

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
  }, [isLoading]);

  const handleToggle = () => {
    setOpen(!open);
  };

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
    // <Card sx={{ padding: '5px', paddingLeft: '32px', paddingRight: '32px' }}>
    //   <CardContent sx={{ padding: '8px' }}>
    //     <Typography variant="h5">{contactName}</Typography>
    //     <Typography>{phoneNumber}</Typography>
    //     <Box sx={{ background: '#00720b40', padding: '5px 5px 5px 5px', width: '100%' }}>
    //       <Box
    //         sx={{
    //           display: 'flex',
    //           alignItems: 'center',
    //           justifyContent: 'space-between',
    //           padding: '0px',
    //           cursor: 'pointer',
    //           height: '18px',
    //         }}
    //         onClick={handleToggle}
    //       >
    //         <Typography color="primary" sx={{ cursor: 'pointer' }}>
    //           View your profile
    //         </Typography>
    //         <IconButton>{open ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
    //       </Box>
    //       <Collapse in={open}>
    //         <div
    //           style={{
    //             display: 'flex',
    //             justifyContent: 'flex-end',
    //           }}
    //         >
    //           <IconButton onClick={handleEditToggle}>
    //             {isEditing ? <Cancel color="error" /> : <IconEdit style={{ color: 'green' }} />}
    //           </IconButton>
    //         </div>
    //         <Box sx={{ mt: 0, display: 'flex', alignItems: 'center' }}>
    //           <div
    //             style={{
    //               marginRight: '1rem',
    //               marginTop: '0.50rem',
    //               display: 'flex',
    //               justifyContent: 'center',
    //               alignItems: 'center',
    //               position: 'relative',
    //             }}
    //           >
    //             <Avatar
    //               src={newProfilePictureURL || profileDetails?.profile_picture_url}
    //               alt="Profile"
    //               sx={{
    //                 width: 100,
    //                 height: 100,
    //                 backgroundColor: '#b6dbc5',
    //                 marginBottom: 2,
    //                 border: '3px solid #cfd5d5',
    //               }}
    //               style={{ borderRadius: '50%' }}
    //             />
    //             {isEditing && (
    //               <IconButton
    //                 component="label"
    //                 sx={{
    //                   position: 'absolute',
    //                   bottom: 0,
    //                   right: 0,
    //                   bgcolor: '#7ab95d29',
    //                   borderRadius: '50%',
    //                 }}
    //               >
    //                 <CameraAlt style={{ color: 'green' }} />
    //                 <Input
    //                   type="file"
    //                   accept="image/*"
    //                   onChange={handleImageChange}
    //                   sx={{ display: 'none' }}
    //                 />
    //               </IconButton>
    //             )}
    //             {uploadingImage && (
    //               <CircularProgress
    //                 sx={{
    //                   position: 'absolute',
    //                   top: '50%',
    //                   left: '50%',
    //                   marginTop: '-20px',
    //                   marginLeft: '-20px',

    //                 }}
    //               />
    //             )}
    //           </div>
    //           <div style={{ width: '90%' }}>
    //             {isEditing ? (
    //               <>
    //                 <div style={{ display: 'flex', gap: '22px' }}>
    //                   <TextField
    //                     name="email"
    //                     label="Email"
    //                     value={editableProfile.email || ''}
    //                     onChange={handleChange}
    //                     fullWidth
    //                     margin="normal"
    //                     sx={{
    //                       backgroundColor: '#ffffff73',
    //                       borderRadius: '6px',
    //                     }}
    //                     autoFocus="true"
    //                   />
    //                   <TextField
    //                     name="websites"
    //                     label="Websites"
    //                     value={editableProfile.websites?.join(', ') || ''}
    //                     onChange={handleChange}
    //                     fullWidth
    //                     margin="normal"
    //                     sx={{
    //                       backgroundColor: '#ffffff73',
    //                       borderRadius: '6px',
    //                     }}
    //                   />
    //                 </div>
    //                 <div style={{ display: 'flex', gap: '22px' }}>
    //                   <TextField
    //                     name="vertical"
    //                     label="Vertical"
    //                     value={editableProfile.vertical || ''}
    //                     onChange={handleChange}
    //                     fullWidth
    //                     margin="normal"
    //                     sx={{
    //                       backgroundColor: '#ffffff73',
    //                       borderRadius: '6px',
    //                     }}
    //                     disabled
    //                   />
    //                   <TextField
    //                     name="messaging_product"
    //                     label="Messaging Product"
    //                     value={editableProfile.messaging_product || ''}
    //                     onChange={handleChange}
    //                     fullWidth
    //                     margin="normal"
    //                     sx={{
    //                       backgroundColor: '#ffffff73',
    //                       borderRadius: '6px',
    //                     }}
    //                     disabled
    //                   />
    //                 </div>
    //                 <TextField
    //                   name="address"
    //                   label="Address"
    //                   value={editableProfile.address || ''}
    //                   onChange={handleChange}
    //                   fullWidth
    //                   margin="normal"
    //                   sx={{
    //                     backgroundColor: '#ffffff73',
    //                     borderRadius: '6px',
    //                   }}
    //                 />
    //                 <TextField
    //                   name="description"
    //                   label="Description"
    //                   value={editableProfile.description || ''}
    //                   onChange={handleChange}
    //                   rows={2}
    //                   multiline
    //                   margin="normal"
    //                   fullWidth
    //                   sx={{
    //                     backgroundColor: '#ffffff73',
    //                     borderRadius: '6px',
    //                   }}
    //                 />
    //                 <TextField
    //                   name="about"
    //                   label="About"
    //                   value={editableProfile.about || ''}
    //                   onChange={handleChange}
    //                   rows={2}
    //                   multiline
    //                   margin="normal"
    //                   fullWidth
    //                   sx={{
    //                     backgroundColor: '#ffffff73',
    //                     borderRadius: '6px',
    //                   }}
    //                 />
    //               </>
    //             ) : (
    //               <>
    //                 {profileDetails?.messaging_product && (
    //                   <Typography lineHeight={'1.664rem'}>
    //                     <strong style={{ fontWeight: '500' }}>Messaging Product:</strong>{' '}
    //                     {profileDetails?.messaging_product}
    //                   </Typography>
    //                 )}
    //                 {profileDetails?.email && (
    //                   <Typography lineHeight={'1.664rem'}>
    //                     <strong style={{ fontWeight: '500' }}>Email:</strong>{' '}
    //                     {profileDetails?.email}
    //                   </Typography>
    //                 )}
    //                 {profileDetails?.websites && profileDetails?.websites.length > 0 && (
    //                   <Typography lineHeight={'1.664rem'}>
    //                     <strong style={{ fontWeight: '500' }}>Websites:</strong>{' '}
    //                     {profileDetails?.websites.join(', ')}
    //                   </Typography>
    //                 )}
    //                 {profileDetails?.address && (
    //                   <Typography lineHeight={'1.664rem'}>
    //                     <strong style={{ fontWeight: '500' }}>Address:</strong>{' '}
    //                     {profileDetails?.address}
    //                   </Typography>
    //                 )}
    //                 {profileDetails?.description && (
    //                   <Typography lineHeight={'1.664rem'}>
    //                     <strong style={{ fontWeight: '500' }}>Description:</strong>{' '}
    //                     {profileDetails?.description}
    //                   </Typography>
    //                 )}
    //                 {profileDetails?.about && (
    //                   <Typography lineHeight={'1.664rem'}>
    //                     <strong style={{ fontWeight: '500' }}>About:</strong>{' '}
    //                     {profileDetails?.about}
    //                   </Typography>
    //                 )}
    //                 {profileDetails?.vertical && (
    //                   <Typography lineHeight={'1.664rem'}>
    //                     <strong style={{ fontWeight: '500' }}>Vertical:</strong>{' '}
    //                     {profileDetails?.vertical}
    //                   </Typography>
    //                 )}
    //               </>
    //             )}
    //           </div>
    //         </Box>
    //       </Collapse>
    //     </Box>
    //     {isEditing && (
    //       <Box sx={{ mt: 2 }}>
    //         <LoadingButton
    //           variant="contained"
    //           color="primary"
    //           onClick={handleSave}
    //           startIcon={<SaveIcon />}
    //           loadingPosition="start"
    //           type="submit"
    //           loading={loading}
    //         >
    //           Save
    //         </LoadingButton>
    //       </Box>
    //     )}
    //   </CardContent>
    // </Card>
    <Card sx={{ padding: '5px', paddingLeft: '32px', paddingRight: '32px' }}>
      <CardContent sx={{ padding: '8px' }}>
        {loading ? (
          <Box>
            <Skeleton variant="text" width="100%" height={40} animation="wave" />
            <Skeleton variant="text" width="60%" height={30} animation="wave" />
            <Skeleton
              variant="rectangular"
              width="100%"
              height={200}
              sx={{ mt: 2 }}
              animation="wave"
            />
          </Box>
        ) : (
          <>
            <Typography variant="h5">{contactName}</Typography>
            <Typography>{phoneNumber}</Typography>
            <Box
              sx={{
                background: '#00720b40',
                padding: '5px 5px 5px 5px',
                width: '100%',
                overflowX: 'auto',
                overflowY: 'hidden',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '18px',
                  cursor: 'pointer',
                  height: '18px',
                }}
                onClick={handleToggle}
              >
                <Typography
                  color="primary"
                  sx={{ cursor: 'pointer' }}
                  fontSize={'0.98rem'}
                  fontWeight={400}
                >
                  View your profile
                </Typography>
                <IconButton>{open ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
              </Box>
              <Collapse in={open}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <IconButton onClick={handleEditToggle}>
                    {isEditing ? <Cancel color="error" /> : <IconEdit style={{ color: 'green' }} />}
                  </IconButton>
                </div>
                <Box sx={{ mt: 0, display: 'flex', alignItems: 'center' }}>
                  <div
                    style={{
                      marginRight: '1rem',
                      marginTop: '0.50rem',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      position: 'relative',
                    }}
                  >
                    <Avatar
                      src={newProfilePictureURL || profileDetails?.profile_picture_url}
                      alt="Profile"
                      sx={{
                        width: 100,
                        height: 100,
                        backgroundColor: '#b6dbc5',
                        marginBottom: 2,
                        border: '3px solid #cfd5d5',
                      }}
                      style={{ borderRadius: '50%' }}
                    />
                    {isEditing && (
                      <IconButton
                        component="label"
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
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
                  </div>
                  <div style={{ width: '90%' }}>
                    {isEditing ? (
                      <>
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
                        <div style={{ display: 'flex', gap: '22px' }}>
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
                      </>
                    ) : (
                      <>
                        {profileDetails?.messaging_product && (
                          <Typography lineHeight={'1.664rem'}>
                            <strong style={{ fontWeight: '500' }}>Messaging Product:</strong>{' '}
                            {profileDetails?.messaging_product}
                          </Typography>
                        )}
                        {profileDetails?.email && (
                          <Typography lineHeight={'1.664rem'}>
                            <strong style={{ fontWeight: '500' }}>Email:</strong>{' '}
                            {profileDetails?.email}
                          </Typography>
                        )}
                        {profileDetails?.websites && profileDetails?.websites.length > 0 && (
                          <Typography lineHeight={'1.664rem'}>
                            <strong style={{ fontWeight: '500' }}>Websites:</strong>{' '}
                            {profileDetails?.websites.join(', ')}
                          </Typography>
                        )}
                        {profileDetails?.address && (
                          <Typography lineHeight={'1.664rem'}>
                            <strong style={{ fontWeight: '500' }}>Address:</strong>{' '}
                            {profileDetails?.address}
                          </Typography>
                        )}
                        {profileDetails?.description && (
                          <Typography lineHeight={'1.664rem'}>
                            <strong style={{ fontWeight: '500' }}>Description:</strong>{' '}
                            {profileDetails?.description}
                          </Typography>
                        )}
                        {profileDetails?.about && (
                          <Typography lineHeight={'1.664rem'}>
                            <strong style={{ fontWeight: '500' }}>About:</strong>{' '}
                            {profileDetails?.about}
                          </Typography>
                        )}
                        {profileDetails?.vertical && (
                          <Typography lineHeight={'1.664rem'}>
                            <strong style={{ fontWeight: '500' }}>Vertical:</strong>{' '}
                            {profileDetails?.vertical}
                          </Typography>
                        )}
                      </>
                    )}
                  </div>
                </Box>
              </Collapse>
            </Box>
            {isEditing && (
              <Box sx={{ mt: 2 }}>
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
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ViewProfileCard;
