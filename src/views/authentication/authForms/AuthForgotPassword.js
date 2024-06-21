import React from 'react';
import { Button, Stack , OutlinedInput,InputAdornment} from '@mui/material';
import { Link } from 'react-router-dom';
import { IconMail } from '@tabler/icons';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';

const AuthForgotPassword = () => (
  <>
    <Stack mt={4} spacing={2}>
      <CustomFormLabel htmlFor="reset-email">Email Adddress</CustomFormLabel>
      <OutlinedInput
            sx={{ marginTop: 2 }}
            startAdornment={
              <InputAdornment position="start">
                <IconMail width={20} color="dimgray" />
              </InputAdornment>
            }
            id="email-text"
            placeholder="Enter Email"
            fullWidth
          />

      <Button color="primary" variant="contained" size="large" fullWidth component={Link} to="/">
        Forgot Password
      </Button>
      <Button color="primary" size="large" fullWidth component={Link} to="/auth/login">
        Back to Login
      </Button>
    </Stack>
  </>
);

export default AuthForgotPassword;
