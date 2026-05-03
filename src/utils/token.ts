import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export function storeToken(token: string) {
  Cookies.set('LIAccessToken', token, {
    expires: new Date((jwtDecode(token)?.exp || 0) * 1000),
  });
}

export function getTokenExperationDateInMSec() {
  const token = getToken();
  return token ? (jwtDecode(token).exp ?? 0) * 1000 : 0;
}

export function getToken() {
  return Cookies.get('LIAccessToken');
}

export function removeToken() {
  Cookies.remove('LIAccessToken');
  window.location.reload();
}

interface CustomJwtPayload {
  username: string;
}

export function getUserName() {
  const token = getToken();
  if (!token) return null;
  const { username } = jwtDecode<CustomJwtPayload>(token);
  return username;
}
