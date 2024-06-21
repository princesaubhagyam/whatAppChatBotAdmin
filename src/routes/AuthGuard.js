import { Navigate, useNavigate } from 'react-router';
import Login2 from 'src/views/authentication/auth2/Login2';

const AuthGuard = () => {
  const hasAuth = localStorage.getItem('ref') && localStorage.getItem('access');
  const navigate = useNavigate();

  if (!hasAuth) {
    return <Login2></Login2>;
  } else {
    return <Navigate to="/"></Navigate>;
  }
};

export default AuthGuard;
