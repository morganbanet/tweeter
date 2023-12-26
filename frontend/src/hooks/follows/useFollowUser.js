import { useState, useEffect } from 'react';
import { useAuthContext } from '../auth/useAuthContext';

export const useFollowUser = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { userInfo } = useAuthContext();

  const followUser = async (userId) => {
    setIsLoading(true);
    setError(null);

    if (!userInfo) {
      setError({ error: 'User must be authenticated' });
      setIsLoading(false);
      return;
    }

    const options = { method: 'POST' };
    const endpoint = `/api/users/${userId}/follows`;
    const response = await fetch(endpoint, options);
    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
      setIsLoading(false);
      return;
    }

    setData(data.data);
    setIsLoading(false);
  };

  return { followUser, data, isLoading, error };
};
