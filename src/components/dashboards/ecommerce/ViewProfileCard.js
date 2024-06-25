import { CardContent, Card, Typography, Collapse, Box, IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import axiosClientBm from 'src/api/axiosClientBm';

const ViewProfileCard = () => {
  const [contactName, setContactName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClientBm.get('phone_numbers');
        const fetchedContactName = response?.data?.data[0]?.verified_name || 'N/A';
        const fetchedPhoneNumber = response?.data?.data[0]?.display_phone_number || 'N/A';

        setContactName(fetchedContactName);
        setPhoneNumber(fetchedPhoneNumber);

        console.log('API Response:', response);
        console.log('Quality Rating:', fetchedContactName);
        console.log('API Status:', fetchedPhoneNumber);
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
    <Card>
      <CardContent>
        <Typography variant="h5">{contactName}</Typography>
        <Typography>{phoneNumber}</Typography>
        <Box sx={{ background: '#00720b40', padding: '5px 15px 5px 15px'}}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography
              color="primary"
              onClick={handleToggle}
              sx={{ cursor: 'pointer' }}
            >
              View your profile
            </Typography>
            <IconButton onClick={handleToggle}>
              {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
          <Collapse in={open}>
            <Box sx={{ mt: 2 }}>
              <Typography>Additional profile details go here.</Typography>
            </Box>
          </Collapse>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ViewProfileCard;
