import React, { useEffect } from 'react';
import { styled, Container, Box, useTheme, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { fetchQualityRating } from 'src/store/apps/chat/ChatSlice';
import Header from './vertical/header/Header';
import HorizontalHeader from '../full/horizontal/header/Header';
import Sidebar from './vertical/sidebar/Sidebar';
import Customizer from './shared/customizer/Customizer';
import Navigation from './horizontal/navbar/Navbar';

const MainWrapper = styled('div')(() => ({
  display: 'flex',
  minHeight: '100vh',
  width: '100%',
}));

const PageWrapper = styled('div')(() => ({
  display: 'flex',
  flexGrow: 1,
  paddingBottom: '60px',
  flexDirection: 'column',
  zIndex: 1,
  width: '100%',
  backgroundColor: 'transparent',
}));

const FullLayout = () => {
  const customizer = useSelector((state) => state.customizer);
  const qualityRating = useSelector((state) => state.chatReducer?.qualityRating);
  const dispatch = useDispatch();
  // console.log('green', qualityRating);
  useEffect(() => {
    dispatch(fetchQualityRating());
  }, [qualityRating]);
  const theme = useTheme();

  // useEffect(() => {
  //   console.log('FullLayout - Initial qualityRating:', qualityRating);

  return (
    <MainWrapper
      className={customizer.activeMode === 'dark' ? 'darkbg mainwrapper' : 'mainwrapper'}
    >
      {/* Sidebar */}
      {customizer.isHorizontal ? '' : <Sidebar />}
      {/* Main Wrapper */}
      <PageWrapper
        className="page-wrapper"
        style={{ padding: 0 }}
        sx={{
          ...(customizer.isCollapse && {
            [theme.breakpoints.up('lg')]: { ml: `${customizer.MiniSidebarWidth}px` },
            maxHeight: 'md 100%!important',
          }),
        }}
      >
        {/* Header */}
        {/* {'UNKNOWN' === 'UNKNOWN' && (
          <Alert severity="warning" sx={{ position: 'fixed' , zIndex: '1300'}}>
            Warning: The quality rating is not GREEN.
          </Alert>
        )} */}
        {customizer.isHorizontal ? <HorizontalHeader /> : <Header />}
        {/* PageContent */}
        {customizer.isHorizontal ? <Navigation /> : ''}
        <Container
          style={{ padding: 12, paddingTop: 3 }}
          sx={{
            maxWidth: customizer.isLayout === 'boxed' ? 'lg' : '100%!important',
          }}
        >
          <Box sx={{ minHeight: { lg: '85vh', xl: '70vh' }, overflow: 'hidden' }}>
            <Outlet />
          </Box>
        </Container>
        <Customizer />
      </PageWrapper>
    </MainWrapper>
  );
};

export default FullLayout;
