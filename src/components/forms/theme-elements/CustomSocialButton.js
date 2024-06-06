import React from 'react';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';

const CustomSocialButton = styled((props) => (
  <Button variant="outlined" size="large" color="inherit" {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  background: `#1877f2`,
  color: `white`,
  '&:hover': {
    color: `#539eff`,
  },
}));

export default CustomSocialButton;
