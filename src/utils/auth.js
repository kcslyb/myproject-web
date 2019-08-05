import Cookies from 'js-cookie'

const LoginKey = 'hasLogin';
// Cookies.set(LoginKey, 0);
export function getToken () {
  return Cookies.get(LoginKey)
}

export function setToken () {
  return Cookies.set(LoginKey, '1')
}

export function removeToken () {
  Cookies.remove('JSESSIONID');
  return Cookies.remove(LoginKey)
}
