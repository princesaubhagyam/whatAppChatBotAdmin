import { CssBaseline, ThemeProvider } from '@mui/material';
import { useRoutes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ThemeSettings } from './theme/Theme';
import RTL from './layouts/full/shared/customizer/RTL';
import ScrollToTop from './components/shared/ScrollToTop';
import Router from './routes/Router';
import toast, { Toaster } from 'react-hot-toast';
import { UserProvider } from 'src/store/apps/UserContext';

import './App.css';
import { EventProvider } from './BroadcastContext';

function App() {
  const routing = useRoutes(Router);
  const theme = ThemeSettings();
  const customizer = useSelector((state) => state.customizer);

  return (
    <EventProvider>
      <ThemeProvider theme={theme}>
        <UserProvider>
          {' '}
          {/* Wrap the application with UserProvider */}
          <Toaster
            position="top-right"
            toastOptions={{
              success: {
                iconTheme: {
                  primary: 'green',
                },
                style: {
                  background: 'green',
                  color: 'white',
                  fontSize: '16px',
                },
              },
              error: {
                iconTheme: {
                  primary: 'red',
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
        </UserProvider>
      </ThemeProvider>
    </EventProvider>
  );
}

export default App;
