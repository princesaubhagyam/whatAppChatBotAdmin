import * as React from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

function BasicAlerts() {
    return (
        <Stack sx={{ width: '100%' }} spacing={2}>
            <Alert severity="error"
                sx={{
                    marginTop: "-70px",
                    zIndex: 1300,
                    width: "80%",
                    height: "65px",
                    fontSize: "18px" ,
        }}
      >This is a warning Alert.</Alert>
    </Stack >
  );
}


export default BasicAlerts