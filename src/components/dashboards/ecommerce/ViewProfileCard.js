import { CardContent,Card, Typography } from '@mui/material';
import React from 'react';

const ViewProfileCard = () => {
    return(
         <Card>
            <CardContent>
                <Typography variant='h5'>Saubhagyam</Typography>
                <Typography>+91 9510500924</Typography>
                <Typography>View your profile</Typography>
            </CardContent>
         </Card>
    )
};

export default ViewProfileCard;