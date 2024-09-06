import { Navigate} from 'react-router';
import Login2 from 'src/views/authentication/auth2/Login2';

const AuthGuard = () => {
  const hasAuth = localStorage.getItem('ref') && localStorage.getItem('access_app');
  if (hasAuth) {
    return <Navigate to="/"></Navigate>;
  } else {
    return <Login2></Login2>;
  }
};

export default AuthGuard;
