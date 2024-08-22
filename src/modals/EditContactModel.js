import React, { useState } from 'react';
import {
  Box,
  Button,
  Modal,
  TextField,
  Grid,
  Typography,
  Select,
  MenuItem,
  Stack,
  FormControl,
} from '@mui/material';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import apiClient from 'src/api/axiosClient';
import { LoadingButton } from '@mui/lab';
import CircularProgress from '@mui/material/CircularProgress';
import countryCodes from 'src/utils/Countrycode.json';

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
    cc: '',
  });
  console.log(editData, 'editData');
  function handleClose() {
    setEdit(false);
    setEditData({
      city: '',
      contact: ' ',
      name: '',
      tag: '',
      cc: '',
    });
  }

  function handleCountryCodeChange(e) {
    setEditData((prevDetails) => ({
      ...prevDetails,
      cc: e.target.value,
    }));
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
      cc: '',
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
          cc: editData.cc.replace('+', ''),
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

        <Stack container spacing={2}>
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
          <FormControl fullWidth error={!!errors.contact}>
            <Grid container spacing={1} alignItems="center">
              <Grid item>
                <Select
                  value={editData.cc}
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
                  value={editData.contact}
                  onChange={handleChange}
                  error={!!errors.contact}
                  helperText={errors.contact}
                  placeholder="91952XXXXXXX"
                />
              </Grid>
            </Grid>
          </FormControl>

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
        </Stack>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            onClick={handleEdit}
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? 'Editing...' : 'Edit'}
          </Button>
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
