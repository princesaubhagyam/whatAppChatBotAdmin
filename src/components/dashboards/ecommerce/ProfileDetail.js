import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Avatar, Box, Skeleton } from '@mui/material';
import createMetaAxiosInstance from 'src/api/axiosClientMeta';
import {Link} from "react-router-dom"

const ProfileDetail = () => {
  const [contactName, setContactName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profilePictureURL, setProfilePictureURL] = useState(null);
  const [loading, setLoading] = useState(true);

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
        console.log('Phone ID:', phoneId);
        const profileResponse = await metaClient.get(
          `https://graph.facebook.com/${phoneId}/whatsapp_business_profile`,
          {
            params: {
              fields: 'profile_picture_url',
            },
          },
        );

        console.log('Profile Response:', profileResponse.data);

        const profileData = profileResponse?.data?.data[0];
        console.log('Profile Data:', profileData);

        if (profileData && profileData.profile_picture_url) {
          setProfilePictureURL(profileData.profile_picture_url);
        } else {
          console.error('Profile picture URL not found');
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Link to = "/business-profile">
    <Card sx={{ padding: '5px', height: '100px' }}>
      <CardContent sx={{ padding: '8px' }}>
        {loading ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ ml: 2, flex: 1 }}>
              <Skeleton variant="text" width="60%" height={40} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="40%" height={30} />
            </Box>
            <Skeleton
              variant="circular"
              width={100}
              height={100}
              sx={{ backgroundColor: '#e0e0e0', borderRadius: '50%' }}
            />
          </Box>
        ) : (
          <Box
            sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'space-between' }}
          >
            <Box sx={{ ml: 2 }}>
              <Typography variant="h5">{contactName}</Typography>
              <Typography>{phoneNumber}</Typography>
            </Box>
            <Avatar
              src={profilePictureURL}
              alt="Profile"
              sx={{
                width: 80,
                height: 80,
                backgroundColor: '#b6dbc5',
                border: '3px solid #cfd5d5',
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
    </Link>
  );
};

export default ProfileDetail;
