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
import whatsAppIcon from "../../assets/images/svgs/whatsAppIcon.svg"
import TwoStepVerificationOTP from "../Models/TwoStepVerificationOTP"
import {
  Select,
  MenuItem,
} from '@mui/material';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function TwoStepVerification({open, setOpen,allUserInfo,fetchData}) {
  const [selectedValue, setSelectedValue] = useState();
  const [optModelOpen,setOptModelOpen] = useState(false)
  const [options, ] = useState([{ id: 1, value: 'WABA', label: 'WABA' },]);
  const handleCloseModel = ()=>{
    setOpen(false);
    setSelectedValue('')
  }
  const handleClose = () => {
    setOpen(false);
    setSelectedValue('')
    setOptModelOpen(true)   
  };
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
  return (
    <React.Fragment>
      <BootstrapDialog
        aria-labelledby="customized-dialog-title"
        open={open}
        sx={{
          '& .MuiDialog-paper': {
            width: '500px', // Set the custom width here
            height: '350px', // Set the custom height here
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          WABA
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseModel}
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
                 {allUserInfo?.data?.verified_name}
                  <Badge
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    sx={{ marginLeft: '5rem' }}
                    badgeContent={allUserInfo?.data?.code_verification_status}
                    color="primary"
                  />
                </Typography>
              </Typography>
              <Typography
               variant="subtitle2" 
               my={2} 
               color="textSecondary" 
               sx={{ display: 'flex' }}
              >
              <img
                   src= {whatsAppIcon}
                   alt='whats App'
                  style={{width:"30px", marginTop: "3px"}}
                  />
                <Typography gutterBottom ml= {2} mt={1}>
                  {allUserInfo?.data?.display_phone_number}
                </Typography>
              </Typography>
            </DialogContent>

            {/* <InputLabel id="demo-simple-select-outlined-label">WABA</InputLabel> */}
            <Select
              sx={{
                width: '300px',
                height: '40px',
              }}
              // labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={selectedValue}
              onChange={handleChange}
              // label="Register Number"
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
            <Button
             autoFocus
             disabled={!selectedValue}
              onClick={handleClose}>
              Save Selection
            </Button>
          </DialogActions>
        </form>
      </BootstrapDialog>
      <TwoStepVerificationOTP
      open = {optModelOpen}
      setOpen={setOptModelOpen}
      allUserInfo = {allUserInfo}
      fetchData = {fetchData}
      />
    </React.Fragment>
  );
}
