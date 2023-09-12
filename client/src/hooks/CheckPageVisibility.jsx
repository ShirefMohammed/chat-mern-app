import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useLocation, useNavigate } from 'react-router-dom';

const CheckPageVisibility = () => {
  const { pathname } = useLocation();
  const [cookies] = useCookies();
  const navigate = useNavigate();

  useEffect(() => {
    !cookies.access_token && navigate("/");
  }, [cookies.access_token, navigate, pathname])

  return "";
}

export default CheckPageVisibility
