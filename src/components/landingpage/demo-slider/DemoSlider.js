import React from 'react';
import { Box, Container, Button, styled, Chip, Stack } from '@mui/material';

//Carousel slider for product
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './demo-slider.css';

// images
import demo1 from 'src/assets/images/landingpage/demos/demo-main.jpg';
import demo2 from 'src/assets/images/landingpage/demos/demo-dark.jpg';
import demo3 from 'src/assets/images/landingpage/demos/demo-horizontal.jpg';
import demo4 from 'src/assets/images/landingpage/demos/demo-firebase.jpg';
import demo5 from 'src/assets/images/landingpage/demos/demo-rtl.jpg';
import app1 from 'src/assets/images/landingpage/apps/app-calendar.jpg';
import app2 from 'src/assets/images/landingpage/apps/app-chat.jpg';
import app3 from 'src/assets/images/landingpage/apps/app-contact.jpg';
import app4 from 'src/assets/images/landingpage/apps/app-email.jpg';
import app5 from 'src/assets/images/landingpage/apps/app-note.jpg';

import DemoTitle from './DemoTitle';
import { NavLink } from 'react-router-dom';

const StyledButton = styled(Button)(({ theme }) => ({
  padding: '12px 37px',
  fontSize: '16px',
  marginTop: '40px',
  fontWeight: 700,
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.text.primary,
  padding: '8px 15px',
}));

const SliderData = [
  {
    avatar: demo1,
    link: 'https://modernize-react-main.netlify.app/dashboards/modern',
    demo: 'Main',
  },
  {
    avatar: demo2,
    link: 'https://modernize-react-dark.netlify.app/dashboards/ecommerce',
    demo: 'Dark',
  },
  {
    avatar: demo3,
    link: 'https://modernize-react-horizontal.netlify.app/',
    demo: 'Horizontal',
  },
  {
    avatar: demo4,
    link: 'https://modernize-react-firebase.netlify.app/auth/login',
    demo: 'Firebase',
  },
  {
    avatar: demo5,
    link: 'https://modernize-react-rtl.netlify.app/dashboards/modern',
    demo: 'RTL',
  },
  {
    link: '/apps/calendar',
    avatar: app1,
    applink: true,
    demo: 'Calendar App',
  },
  {
    link: '/apps/chats',
    avatar: app2,
    applink: true,
    demo: 'Chat App',
  },
  {
    link: 'apps/contacts',
    avatar: app3,
    applink: true,
    demo: 'Contact App',
  },
  {
    link: 'apps/email',
    avatar: app4,
    applink: true,
    demo: 'Email App',
  },
  {
    link: '/apps/notes',
    avatar: app5,
    applink: true,
    demo: 'Notes App',
  },
];

const DemoSlider = () => {
  const settings = {
    className: 'demo-slider',
    dots: true,
    arrows: false,
    infinite: true,
    adaptiveHeight: true,
  };

  return (
    <Box
      pb="140px"
      overflow="hidden"
      sx={{
        pt: {
          sm: '60px',
          lg: '0',
        },
      }}
    >
      <Container maxWidth="lg">
        {/* Title */}
        <DemoTitle />

        {/* slider */}
        <Box mt={9}>
          <Slider {...settings}>
            {SliderData.map((slider, index) => (
              <Box key={index} textAlign="center" p={1} className="imgbox">
                <Stack
                  direction="row"
                  justifyContent="center"
                  mb="-15px"
                  zIndex="9"
                  position="relative"
                >
                  <StyledChip color="primary" label={slider.demo}></StyledChip>
                </Stack>
                <img src={slider.avatar} alt="demos" />
                {slider.applink ? (
                  <NavLink to={slider.link}>
                    <StyledButton variant="contained">Live Preview</StyledButton>
                  </NavLink>
                ) : (
                  <StyledButton href={slider.link} variant="outlined">
                    Live Preview
                  </StyledButton>
                )}
              </Box>
            ))}
          </Slider>
        </Box>
      </Container>
    </Box>
  );
};

export default DemoSlider;
