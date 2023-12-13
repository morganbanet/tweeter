import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useLogout = () => {
  const [error, setError] = useState(null);

  const { dispatch } = useAuthContext();

  const logout = async () => {
    setError(null);

    const options = {
      method: 'POST',
    };

    const response = await fetch('/api/auth/logout', options);
    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
      return;
    }

    localStorage.removeItem('userInfo');

    dispatch({ type: 'LOGOUT_USER' });
  };

  return { logout, error };
};
