import React, { useState } from 'react';
import { Box, Button, Modal, TextField, Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import toast, { Toaster } from 'react-hot-toast';
import apiClient from 'src/api/axiosClient';
import { Link, useNavigate } from 'react-router-dom';
const AddContactModal = ({ open, handleClose, onAddContact }) => {
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const [contactDetails, setContactDetails] = useState({
    name: '',
    contact: '',
    city: '',
    tag: '',
  });

  const [validity, setValidity] = useState({
    name: true,
    contact: true,
    city: true,
    tag: true,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setContactDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));

    setValidity((prevValidity) => ({
      ...prevValidity,
      [name]: value.trim() !== '',
    }));
  };

  const handleCreate = async () => {
    const isValid = Object.values(validity).every((value) => value);

    if (isValid) {
      try {
        setLoading(true);
        const response = await apiClient.post('/api/contacts/', contactDetails);
        toast.success('Contact created successfully!', { closeButton:  true });
        setContactDetails({
          name: '',
          contact: '',
          city: '',
          tag: '',
        });
        handleClose();
        onAddContact(response.data); // Pass the new contact data back to the parent
      } catch (error) {
        // console.error('Failed to create contact:', error);
        toast.error('Failed to create contact.');
      } finally {
        setLoading(false);
      }
    } else {
      console.log('Some fields are empty.');
      toast.error('Please fill in all fields.');
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
          width: '45%',
          margin: 'auto',
          mt: 10,
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          Add Contact
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={contactDetails.name}
              onChange={handleChange}
              error={!validity.name}
            />
            {!validity.name && (
              <Typography variant="body2" color="error">
                Name is required
              </Typography>
            )}
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Contact"
              name="contact"
              value={contactDetails.contact}
              onChange={handleChange}
              error={!validity.contact}
            />
            {!validity.contact && (
              <Typography variant="body2" color="error">
                Contact is required
              </Typography>
            )}
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="City"
              name="city"
              value={contactDetails.city}
              onChange={handleChange}
              error={!validity.city}
            />
            {!validity.city && (
              <Typography variant="body2" color="error">
                City is required
              </Typography>
            )}
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Tag"
              name="tag"
              value={contactDetails.tag}
              onChange={handleChange}
              error={!validity.tag}
            />
            {!validity.tag && (
              <Typography variant="body2" color="error">
                Tag is required
              </Typography>
            )}
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button onClick={handleCreate} variant="contained" color="primary" disabled={loading}>
            Create
          </Button>
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
