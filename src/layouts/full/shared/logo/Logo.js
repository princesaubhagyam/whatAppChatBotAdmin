import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
// import { ReactComponent as LogoDark } from 'src/assets/images/logos/dark-logo.svg';
// import { ReactComponent as LogoDarkRTL } from 'src/assets/images/logos/dark-rtl-logo.svg';
// import { ReactComponent as LogoLight } from 'src/assets/images/logos/light-logo.svg';
// import { ReactComponent as LogoLightRTL } from 'src/assets/images/logos/light-logo-rtl.svg';
import { Box, Typography, styled } from '@mui/material';

const Logo = () => {
  const customizer = useSelector((state) => state.customizer);
  const LinkStyled = styled(Box)(() => ({
    // height: customizer.TopbarHeight,
    // width: customizer.isCollapse ? '40px' : '180px',
    overflow: 'hidden',
    display: 'block',
    padding: '24px',
  }));

  if (customizer.activeDir === 'ltr') {
    return (
      <LinkStyled to="/">
        {customizer.activeMode === 'dark' ? (
          <Typography variant="h3" color={'primary.main'} fontWeight={700}>
            {customizer.isCollapse ? 'S' : 'Saubhagyam'}
          </Typography>
        ) : (
          <Typography variant="h3" color={'primary.main'} fontWeight={700}>
            {customizer.isCollapse ? 'S' : 'Saubhagyam'}
          </Typography>
        )}
      </LinkStyled>
    );
  }
  return (
    <LinkStyled to="/">
      {customizer.activeMode === 'dark' ? (
        <Typography variant="h3">Saubhagyam</Typography>
      ) : (
        <Typography variant="h3">Saubhagyam</Typography>
      )}
    </LinkStyled>
  );
};

export default Logo;
