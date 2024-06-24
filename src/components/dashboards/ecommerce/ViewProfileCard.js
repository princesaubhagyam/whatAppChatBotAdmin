import { CardContent,Card, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import axiosClientBm from 'src/api/axiosClientBm';


const ViewProfileCard = () => {
    const [contactName, setcontactName] = useState(); 
    const [phoneNumber, setphoneNumber] = useState();
    
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axiosClientBm.get('phone_numbers');
            const fetchedContactName = response?.data?.data[0]?.verified_name;
            const fetchedPhoneNumber = response?.data?.data[0]?.display_phone_number;
    
            setcontactName(fetchedContactName);
            setphoneNumber(fetchedPhoneNumber);
    
            console.log('API Response:', response);
            console.log('Quality Rating:', fetchedContactName);
            console.log('API Status:', fetchedPhoneNumber);
          } catch (error) {
            console.error('Failed to fetch data:', error);
          }
        };
    
        fetchData();
      }, []);
    return(
         <Card>
            <CardContent>
                <Typography variant='h5'>{contactName}</Typography>
                <Typography>{phoneNumber}</Typography>
                <Typography>View your profile</Typography>
            </CardContent>
         </Card>
    )
};

export default ViewProfileCard;