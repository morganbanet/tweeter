import { useState } from 'react';

import { useAuthContext } from './useAuthContext';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(null);
  const [error, setError] = useState(null);

  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    // retrieve form field values
    const body = { email, password };

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    };

    // login user
    const response = await fetch('/api/auth/login', options);
    const data = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(data.message);
      return;
    }

    // set local storage expiry on user info object
    const expiry = 30 * 24 * 60 * 60 * 1000; // 30 days
    const timestamp = Date.now() + expiry;

    const userInfo = { timestamp, ...data.data };

    // save user info in local storage (jwt is in cookie)
    localStorage.setItem('userInfo', JSON.stringify(userInfo));

    // set user info in state
    dispatch({ type: 'LOGIN_USER', payload: userInfo });

    setIsLoading(false);
  };

  return { login, isLoading, error };
};
