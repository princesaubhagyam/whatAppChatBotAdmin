import React from 'react';
import Box from '@mui/material/Box';
import Notfound from 'src/assets/images/backgrounds/Notfoundsearch.png';

function Nodatainsearch() {
  return (
    <>
      <Box my={4} display="flex" alignItems="center" justifyContent="center" gap={4}>
        <Box component="img" src={Notfound} alt="Do data Found" sx={{ width: '30%' }} />
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          fontSize: '1rem',
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
        }}
      >
        No Data found
      </Box>
    </>
  );
}
export default Nodatainsearch;
