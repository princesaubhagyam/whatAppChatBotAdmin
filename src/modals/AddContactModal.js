import React, { useState } from 'react';
import {
  Box,
  Button,
  Modal,
  TextField,
  Grid,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Stack,
} from '@mui/material';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import apiClient from 'src/api/axiosClient';
import { LoadingButton } from '@mui/lab';
import CircularProgress from '@mui/material/CircularProgress';
import countryCodes from 'src/utils/Countrycode.json';

const AddContactModal = ({ open, handleClose, onAddContact }) => {
  const [loading, setLoading] = useState(false);
  const [contactDetails, setContactDetails] = useState({
    name: '',
    contact: '',
    city: '',
    tag: '',
  });
  const [countryCode, setCountryCode] = useState('+91');
  const [errors, setErrors] = useState({
    name: '',
    contact: '',
    city: '',
    tag: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setContactDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const handleCountryCodeChange = (event) => {
    setCountryCode(event.target.value);
  };

  const validateFields = () => {
    let isValid = true;
    const tempErrors = {
      name: '',
      contact: '',
      city: '',
      tag: '',
    };

    if (!contactDetails.name.trim()) {
      tempErrors.name = 'Name is required';
      isValid = false;
    }
    if (!contactDetails.contact.trim()) {
      tempErrors.contact = 'Contact is required';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleCreate = async () => {
    if (validateFields()) {
      try {
        setLoading(true);
        const contactData = {
          name: contactDetails.name.trim(),
          contact: countryCode + contactDetails.contact.trim(),
          city: contactDetails.city.trim() || '-',
          tag: contactDetails.tag.trim() || '-',
        };
        const response = await apiClient.post('/api/contacts/', contactData);
        toast.success('Contact created successfully!', { closeButton: true });
        setContactDetails({
          name: '',
          contact: '',
          city: '',
          tag: '',
        });
        setCountryCode('+91'); // Reset to default code
        handleClose();
        onAddContact(response.data); // Pass the new contact data back to the parent
      } catch (error) {
        toast.error('Failed to create contact.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="add-contact-modal"
      aria-describedby="add-contact-form"
    >
      <Box
        sx={{
          outline: 'none',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          width: '50%',
          margin: 'auto',
          mt: 10,
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          Add Contact
        </Typography>
        <Stack container spacing={2}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={contactDetails.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            placeholder="Enter name"
          />

          <FormControl fullWidth error={!!errors.contact}>
            <Grid container spacing={1} alignItems="center">
              <Grid item>
                <Select
                  value={countryCode}
                  onChange={handleCountryCodeChange}
                  sx={{ width: 'auto', minWidth: '100px' }}
                >
                  {countryCodes.map((code) => (
                    <MenuItem key={code.dial_code} value={code.dial_code}>
                      {code.code} ({code.dial_code})
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs>
                <TextField
                  fullWidth
                  label="Contact"
                  name="contact"
                  value={contactDetails.contact}
                  onChange={handleChange}
                  error={!!errors.contact}
                  helperText={errors.contact}
                  placeholder="Enter contact number"
                />
              </Grid>
            </Grid>
          </FormControl>

          <TextField
            fullWidth
            label="City"
            name="city"
            value={contactDetails.city}
            onChange={handleChange}
            error={!!errors.city}
            helperText={errors.city}
            placeholder="Enter City"
          />

          <TextField
            fullWidth
            label="Tag"
            name="tag"
            value={contactDetails.tag}
            onChange={handleChange}
            error={!!errors.tag}
            helperText={errors.tag}
            placeholder="Enter tag"
          />
        </Stack>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <LoadingButton
            onClick={handleCreate}
            variant="contained"
            color="primary"
            disabled={loading}
            loadingPosition="start"
            loadingIndicator={
              <React.Fragment>
                <CircularProgress size={18} color="inherit" />
                {/* Creating.. */}
              </React.Fragment>
            }
          >
            Create
          </LoadingButton>
          <Button onClick={handleClose} variant="contained" color="error" sx={{ ml: 2 }}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

AddContactModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  onAddContact: PropTypes.func.isRequired,
};

export default AddContactModal;
