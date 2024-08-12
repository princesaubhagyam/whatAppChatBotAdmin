import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import OtpInput from 'react-otp-input';
import apiClient from 'src/api/axiosClient';
import toast from 'react-hot-toast'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function TwoStepVerificationOTP({open,setOpen,allUserInfo,fetchData}) {
  const [otp, setOtp] = React.useState('');
  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (otp) => {
    setOtp(otp);
  };

  function onSubmitHandle(){
    try {
      const  id = allUserInfo?.data?.id
      const requestBody = otp
     apiClient.post(`auth/registerphone/${id}/`,requestBody,{
      headers: {
        'Access-Token': allUserInfo?.accessToken
      }
     })
     .then((response)=>{
       console.log(response)
       if(response.status){
        toast.success('Account Verified', { duration: 2000 })
        fetchData()
        handleClose()
        setOtp('')
        
       }
     }).catch((error)=>{
      toast.error(error.toString(), { duration: 2000 })
       console.error(error)
       
     })
    } catch (error) {
      toast.error(error.toString(), { duration: 2000 })
      console.error(error)
    }
  }
  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        sx={{
          '& .MuiDialog-paper': {
            width: '500px',
            height: '300px',
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          OTP
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
        <form onSubmit={onSubmitHandle}>
          <DialogContent dividers>
            <DialogContent>
              <Typography variant="subtitle2" my={2} color="textSecondary">
                <div>
                  <OtpInput
                    value={otp}
                    onChange={handleChange}
                    numInputs={5}
                    separator={<span>-</span>}
                    renderInput={(props) => <input {...props} />}
                    isInputNum
                    inputStyle={{
                      width: '3rem',
                      height: '3rem',
                      margin: '0 1rem',
                      fontSize: '2rem',
                      borderRadius: 4,
                      border: '1px solid rgba(0,0,0,0.3)',
                    }}
                  />
                </div>
              </Typography>
            </DialogContent>
          </DialogContent>
          <DialogActions>
            <Button  
            type='submit'>
              Verify Number
            </Button>
          </DialogActions>
        </form>
      </BootstrapDialog>
    </React.Fragment>
  );
}
