import { useState } from 'react';

export default function useToken() {
  const [token, setToken] = useState(() => {
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken;
  });

  const saveToken = (userToken) => {
    sessionStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken.token);
  };

  return {
    getToken: () => token,
    setToken: saveToken,
    token,
  };
}
