import React from 'react';
import { Grid, Typography, Box, Breadcrumbs, Link, Button } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';

// import breadcrumbImg from 'src/assets/images/breadcrumb/ChatBc.png';
import { IconCircle } from '@tabler/icons';

const Breadcrumb = ({ subtitle, items, title, children, createUrl }) => {
  const navigate = useNavigate();
  return (
    <Grid
      container
      sx={{
        // backgroundColor: 'white',
        borderRadius: (theme) => theme.shape.borderRadius / 4,
        p: '0px 30px 0px 0px',
        margin: '30px 0px 0px 15px',
        marginp: '30px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Grid item xs={12} sm={6} lg={8} mb={1}>
        <Typography variant="h4">{title}</Typography>
        <Typography color="textSecondary" variant="h6" fontWeight={400} mt={0.8} mb={0}>
          {subtitle}
        </Typography>
        <Breadcrumbs
          separator={
            <IconCircle
              size="5"
              fill="textSecondary"
              fillOpacity={'0.6'}
              style={{ margin: '0 5px' }}
            />
          }
          sx={{ alignItems: 'center', mt: items ? '10px' : '' }}
          aria-label="breadcrumb"
        >
          {items
            ? items.map((item) => (
                <div key={item.title}>
                  {item.to ? (
                    <Link underline="none" color="inherit" component={NavLink} to={item.to}>
                      {item.title}
                    </Link>
                  ) : (
                    <Typography color="textPrimary">{item.title}</Typography>
                  )}
                </div>
              ))
            : ''}
        </Breadcrumbs>
      </Grid>
      <Grid item xs={12} sm={6} lg={4} display="flex" alignItems="flex-end">
        <Box
          sx={{
            display: { xs: 'none', md: 'block', lg: 'flex' },
            alignItems: 'center',
            justifyContent: 'flex-end',
            width: '100%',
          }}
        >
          {createUrl ? (
            <>
              <Box sx={{ top: '0px', position: 'absolute' }}>
                <Button variant="contained" color="primary" onClick={() => navigate(createUrl)}>
                  Create Template
                </Button>
              </Box>
            </>
          ) : (
            <></>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default Breadcrumb;
