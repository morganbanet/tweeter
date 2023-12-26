import { useState, useEffect } from 'react';
import { useAuthContext } from '../auth/useAuthContext';

export const useUnfollowUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { userInfo } = useAuthContext();

  const unfollowUser = async (followId) => {
    setIsLoading(true);
    setError(null);

    if (!userInfo) {
      setError({ error: 'User must be authenticated' });
      setIsLoading(false);
      return;
    }

    const options = { method: 'DELETE' };
    const endpoint = `/api/follows/${followId}`;
    const response = await fetch(endpoint, options);
    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  };

  return { unfollowUser, isLoading, error };
};
