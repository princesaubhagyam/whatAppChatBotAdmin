import {
  CardContent,
  Card,
  Typography,
  Collapse,
  Box,
  IconButton,
  TextField,
  Button,
  TextareaAutosize,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import createMetaAxiosInstance from 'src/api/axiosClientMeta';
import { IconEdit } from '@tabler/icons';
import SaveIcon from '@mui/icons-material/Save';
import { Cancel } from '@mui/icons-material';

const ViewProfileCard = () => {
  const [contactName, setContactName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profileDetails, setProfileDetails] = useState({});
  const [editableProfile, setEditableProfile] = useState({});
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
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
      }
    };

    fetchData();
  }, []);

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setEditableProfile((prev) => ({ ...prev, [name]: value }));
  // };
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

  const handleSave = async () => {
    try {
      const metaClient = createMetaAxiosInstance();
      const phoneId = localStorage.getItem('phone_id');

      // Ensure websites is an array
      const websitesArray = Array.isArray(editableProfile.websites) ? editableProfile.websites : [];

      await metaClient.post(`https://graph.facebook.com/${phoneId}/whatsapp_business_profile`, {
        messaging_product: 'whatsapp',
        about: editableProfile.about || '',
        address: editableProfile.address || '',
        description: editableProfile.description || '',
        email: editableProfile.email || '',
        websites: websitesArray,
      });
      setProfileDetails(editableProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  };

  return (
    <Card sx={{ padding: '5px', paddingLeft: '32px', paddingRight: '32px' }}>
      <CardContent sx={{ padding: '8px' }}>
        <Typography variant="h5">{contactName}</Typography>
        <Typography>{phoneNumber}</Typography>
        <Box sx={{ background: '#00720b40', padding: '5px 5px 5px 5px', width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0px',
              cursor: 'pointer',
              height: '18px',
            }}
            onClick={handleToggle}
          >
            <Typography color="primary" sx={{ cursor: 'pointer' }}>
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
            <Box sx={{ mt: 0, display: 'flex' }}>
              <div style={{ marginRight: '1rem', marginTop: '0.50rem' }}>
                {profileDetails?.profile_picture_url && (
                  <img
                    src={profileDetails?.profile_picture_url}
                    alt="Profile"
                    height={50}
                    width={50}
                  />
                )}
              </div>
              <div style={{ width: '90%'}}>
                {isEditing ? (
                  <>
                    <div style={{ display: 'flex',gap: '22px' }}>
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
                        autoFocus="true"
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
                    <TextField
                      name="address"
                      label="Address"
                      value={editableProfile.address || ''}
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
                    <Typography lineHeight={'1.664rem'}>
                      <strong style={{ fontWeight: '500' }}>Email:</strong> {profileDetails?.email}
                    </Typography>
                    <Typography lineHeight={'1.664rem'}>
                      <strong style={{ fontWeight: '500' }}>Websites:</strong>{' '}
                      {profileDetails?.websites ? profileDetails?.websites.join(', ') : 'N/A'}
                    </Typography>
                    <Typography lineHeight={'1.664rem'}>
                      <strong style={{ fontWeight: '500' }}>Address:</strong>{' '}
                      {profileDetails?.address}
                    </Typography>
                  </>
                )}
              </div>
            </Box>
          </Collapse>
        </Box>
        {isEditing && (
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ViewProfileCard;
