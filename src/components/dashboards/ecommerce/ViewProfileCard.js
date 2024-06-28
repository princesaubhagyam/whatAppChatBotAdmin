import { CardContent, Card, Typography, Collapse, Box, IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import createMetaAxiosInstance from 'src/api/axiosClientMeta';

const ViewProfileCard = () => {
  const [contactName, setContactName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profileDetails, setProfileDetails] = useState({});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch phone number details
        const metaClient = createMetaAxiosInstance();
        const phoneResponse = await metaClient.get('phone_numbers');
        const fetchedContactName = phoneResponse?.data?.data[0]?.verified_name || 'N/A';
        const fetchedPhoneNumber = phoneResponse?.data?.data[0]?.display_phone_number || 'N/A';

        setContactName(fetchedContactName);
        setPhoneNumber(fetchedPhoneNumber);

        console.log('Phone API Response:', phoneResponse);

        const phoneId = 119306844496484;
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

        console.log('Profile API Response:', profileResponse);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <Card sx={{ padding: '5px' }}>
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
            }}
            onClick={handleToggle}
          >
            <Typography color="primary" sx={{ cursor: 'pointer' }}>
              View your profile
            </Typography>
            <IconButton>{open ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
          </Box>
          <Collapse in={open}>
            <Box sx={{ mt: 2, display: 'flex' }}>
              <div style={{ marginRight: '1rem' }}>
                {profileDetails?.profile_picture_url && (
                  <img
                    src={profileDetails?.profile_picture_url}
                    alt="Profile"
                    height={50}
                    width={50}
                  />
                )}
              </div>
              <div>
                <Typography>
                  <strong style={{ fontWeight: '500' }}>Email:</strong> {profileDetails?.email}
                </Typography>
                <Typography>
                  <strong style={{ fontWeight: '500' }}>Websites:</strong>{' '}
                  {profileDetails?.websites ? profileDetails?.websites.join(', ') : 'N/A'}
                </Typography>
              </div>
            </Box>
            {/* <Typography>
                <strong style={{ fontWeight: '500'}}>About:</strong> {profileDetails?.about}
              </Typography> */}
            <Typography>
              <strong style={{ fontWeight: '500' }}>Address:</strong> {profileDetails?.address}
            </Typography>
          </Collapse>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ViewProfileCard;
