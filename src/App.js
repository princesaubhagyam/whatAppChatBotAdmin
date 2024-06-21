import { CssBaseline, ThemeProvider, duration } from '@mui/material';
import { useRoutes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ThemeSettings } from './theme/Theme';
import RTL from './layouts/full/shared/customizer/RTL';
import ScrollToTop from './components/shared/ScrollToTop';
import Router from './routes/Router';
import toast, { Toaster } from 'react-hot-toast';

import './App.css';
function App() {
  const routing = useRoutes(Router);
  const theme = ThemeSettings();
  const customizer = useSelector((state) => state.customizer);

  return (
    <ThemeProvider theme={theme}>
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            iconTheme: {
               primary: 'green'
            },
            style: {
              background: 'green',
              color: 'white',
              fontSize: '16px',
            },
          },
          error: {
            iconTheme: {
               primary: 'red'
            },
            style: {
              background: 'red',
              color: 'white',
              fontSize: '16px',
              
            },
          },
        }}
      />
      <RTL direction={customizer.activeDir}>
        <CssBaseline />
        <ScrollToTop>{routing}</ScrollToTop>
      </RTL>
    </ThemeProvider>
  );
}

export default App;
