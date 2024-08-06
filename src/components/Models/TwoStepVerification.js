import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { Badge } from '@mui/material';
import {
  Select,
  InputLabel,
  MenuItem,
  // FormControl
} from '@mui/material';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function TwoStepVerification() {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  // const [loading, setLoading] = useState(true);
  const [
    options,
    //  setOptions
  ] = useState([
    { id: 1, value: 'value1', label: 'Label 1' },
    { id: 2, value: 'value2', label: 'Label 2' },
  ]);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // useEffect(() => {
  //   // Fetch the options data from API
  //   axios.get('https://api.example.com/data')
  //     .then(response => {
  //       setOptions(response.data);
  //       setLoading(false);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching data:', error);
  //       setLoading(false);
  //     });
  // }, []);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  // const handleSubmit = () => {
  //   const payload = { selectedOption: selectedValue };
  //   axios.post('https://api.example.com/submit', payload)
  //     .then(response => {
  //       console.log('Data submitted successfully:', response.data);
  //     })
  //     .catch(error => {
  //       console.error('Error submitting data:', error);
  //     });
  // };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open dialog
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        sx={{
          '& .MuiDialog-paper': {
            width: '600px', // Set the custom width here
            height: '400px', // Set the custom height here
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          WABA
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <form>
          <DialogContent dividers>
            <DialogContent>
              <Typography variant="subtitle2" my={2} color="textSecondary">
                <Typography gutterBottom>
                  User Business name
                  <Badge
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    sx={{ marginLeft: '5rem' }}
                    badgeContent="verified"
                    color="primary"
                  />
                </Typography>
              </Typography>
            </DialogContent>

            <InputLabel id="demo-simple-select-outlined-label">Register Number</InputLabel>
            <Select
              sx={{
                width: '300px',
                height: '40px',
              }}
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={selectedValue}
              onChange={handleChange}
              label="Register Number"
            >
              {options &&
                options.length > 0 &&
                options.map(function (option) {
                  return (
                    <MenuItem key={option.id} value={option.value}>
                      {option.label}
                    </MenuItem>
                  );
                })}
            </Select>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose}>
              Save Selection
            </Button>
          </DialogActions>
        </form>
      </BootstrapDialog>
    </React.Fragment>
  );
}
