import { useMediaQuery, Box, Drawer, useTheme } from '@mui/material';
import SidebarItems from './SidebarItems';
import Logo from '../../shared/logo/Logo';
import { useSelector, useDispatch } from 'react-redux';
import { hoverSidebar, toggleMobileSidebar } from 'src/store/customizer/CustomizerSlice';
import LogoImg from 'src/assets/images/logos/home_logo.png';
import { useNavigate } from 'react-router';

const Sidebar = () => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const customizer = useSelector((state) => state.customizer);
  const dispatch = useDispatch();
  const theme = useTheme();
  const toggleWidth =
    customizer.isCollapse && !customizer.isSidebarHover
      ? customizer.MiniSidebarWidth
      : customizer.SidebarWidth;
  const navigate = useNavigate();
  const onHoverEnter = () => {
    if (customizer.isCollapse) {
      dispatch(hoverSidebar(true));
    }
  };

  const onHoverLeave = () => {
    dispatch(hoverSidebar(false));
  };

  if (lgUp) {
    return (
      <Box
        sx={{
          //width: toggleWidth,

          flexShrink: 0,
          ...(customizer.isCollapse && {
            position: 'absolute',
          }),
          width: '80px',
        }}
      >
        {/* ------------------------------------------- */}
        {/* Sidebar for desktop */}
        {/* ------------------------------------------- */}
        <Drawer
          anchor="left"
          open
          onMouseEnter={onHoverEnter}
          onMouseLeave={onHoverLeave}
          variant="permanent"
          PaperProps={{
            sx: {
              transition: theme.transitions.create('width', {
                duration: theme.transitions.duration.shortest,
              }),
              width: '80px',
              boxSizing: 'border-box',
              overflowY: 'visible',
            },
          }}
        >
          {/* ------------------------------------------- */}
          {/* Sidebar Box */}
          {/* ------------------------------------------- */}
          <Box
            sx={{
              backgroundColor:
                customizer.activeSidebarBg === '#ffffff' && customizer.activeMode === 'dark'
                  ? customizer.darkBackground900
                  : customizer.activeSidebarBg,
              color: customizer.activeSidebarBg === '#ffffff' ? '' : 'white',
              height: '100%',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
            }}
          >
            {/* ------------------------------------------- */}
            {/* Logo */}
            {/* ------------------------------------------- */}
            <Box
              // p="5px"
              textAlign={'center'}
              onClick={() => {
                navigate('/home');
              }}
              sx={{
                cursor: 'pointer',
                //  padding: "5px 5px 10px 5px",
                position: 'fixed',
                top: '5px',
                left: '15px',
                boxShadow: '0px 0px 0px rgba(0, 0, 0, 0) !important',
              }}
            >
              {/* <Logo/> */}
              <img src={LogoImg} alt="img" height={'50px'} width={'50px'}></img>
            </Box>
            {/* <Scrollbar sx={{ height: 'calc(100% - 190px)' }}> */}
            {/* ------------------------------------------- */}
            {/* Sidebar Items */}
            {/* ------------------------------------------- */}
            <SidebarItems />
            {/* </Scrollbar> */}
            {/* <Profile /> */}
          </Box>
        </Drawer>
      </Box>
    );
  }

  return (
    <Drawer
      anchor="left"
      open={customizer.isMobileSidebar}
      onClose={() => dispatch(toggleMobileSidebar())}
      variant="temporary"
      PaperProps={{
        sx: {
          width: customizer.SidebarWidth,
          backgroundColor:
            customizer.activeMode === 'dark'
              ? customizer.darkBackground900
              : customizer.activeSidebarBg,
          color: customizer.activeSidebarBg === '#ffffff' ? '' : 'white',
          border: '0 !important',
          boxShadow: (theme) => theme.shadows[8],
        },
      }}
    >
      {/* ------------------------------------------- */}
      {/* Logo */}
      {/* ------------------------------------------- */}
      <Box px={2} sx={{ boxShadow: '0px 0px 0px rgba(0, 0, 0, 0) !important' }}>
        <Logo />
      </Box>
      {/* ------------------------------------------- */}
      {/* Sidebar For Mobile */}
      {/* ------------------------------------------- */}
      <SidebarItems />
    </Drawer>
  );
};

export default Sidebar;
