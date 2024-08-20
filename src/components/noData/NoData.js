import React from "react"
import Box from '@mui/material/Box';
import NodataFound from "../../assets/images/backgrounds/noDatafound.jpg"

function NoData(){
    return (
    <>
        <Box
        my={4}
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap={4}
        p={2}
      >
         <Box component="img" src={NodataFound} alt= "Do data Found" sx={{ width: "30%" }} />
      </Box>
       <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
            fontSize: '1.8rem', 
            fontFamily: 'Arial, sans-serif',
            fontWeight: 'bold',
          }}
       >
       No Data found
    </Box>
    </>
      
    )
}
 export default NoData