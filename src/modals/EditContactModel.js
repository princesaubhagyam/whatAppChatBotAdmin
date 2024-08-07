import React, { useState } from 'react';
import { Box, Button, Modal, TextField, Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import apiClient from 'src/api/axiosClient';
import { LoadingButton } from '@mui/lab';
import CircularProgress from '@mui/material/CircularProgress';

const EditContactModal = ({
  open,
  selected,
  setEdit,
  editData,
  setEditData,
  getApiData,
  setSelected,
}) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    contact: '',
    city: '',
    tag: '',
  });
  console.log(editData, 'editData');
  function handleClose() {
    setEdit(false);
    setEditData({
      city: '',
      contact: ' ',
      name: '',
      tag: '',
    });
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditData((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
    // Clear the error for the current field when user starts typing
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const validateFields = () => {
    let isValid = true;
    const tempErrors = {
      name: '',
      contact: '',
      city: '',
      tag: '',
    };

    // Validate each field
    if (!editData.name.trim()) {
      tempErrors.name = 'Name is required';
      isValid = false;
    }
    if (!editData.contact.trim()) {
      tempErrors.contact = 'Contact is required';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleEdit = async () => {
    console.log('edit Hande running');
    if (validateFields()) {
      console.log('indesie edit Hande running');
      try {
        setLoading(true);
        const contactDataEdit = {
          ...editData,
          city: editData.city.trim() || '-',
          tag: editData.tag.trim() || '-',
        };

        const id = selected[0];
        console.log('id', id);
        await apiClient.patch(`/api/contacts/${id}/`, contactDataEdit);
        toast.success('Contact Edit successfully!', { closeButton: true });
        setEdit(false);
        setEditData({
          city: '',
          contact: ' ',
          name: '',
          tag: '',
        });
        getApiData();
        setSelected([]);
        // onAddContact(response.data); // Pass the new contact data back to the parent
      } catch (error) {
        toast.error('Failed to Edit contact.');
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
          Edit Contact
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={editData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              placeholder="Enter name"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Contact"
              name="contact"
              value={editData.contact}
              onChange={handleChange}
              error={!!errors.contact}
              helperText={errors.contact}
              placeholder="91952XXXXXXX"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="City"
              name="city"
              value={editData.city}
              onChange={handleChange}
              error={!!errors.city}
              helperText={errors.city}
              placeholder="Enter City"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Tag"
              name="tag"
              value={editData.tag}
              onChange={handleChange}
              error={!!errors.tag}
              helperText={errors.tag}
              placeholder="Enter tag"
            />
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <LoadingButton
            onClick={handleEdit}
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
            Edit
          </LoadingButton>
          <Button onClick={handleClose} variant="contained" color="error" sx={{ ml: 2 }}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

EditContactModal.propTypes = {
  open: PropTypes.bool.isRequired,
  selected: PropTypes.func.isRequired,
  setEdit: PropTypes.func.isRequired,
};

export default EditContactModal;
