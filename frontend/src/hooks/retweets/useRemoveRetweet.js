import { useState } from 'react';
import { useAuthContext } from '../auth/useAuthContext';

export const useRemoveRetweet = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { userInfo } = useAuthContext();

  const removeRetweet = async (retweetId) => {
    setIsLoading(true);
    setError(null);

    if (!userInfo) {
      setError({ error: 'User must be authenticated' });
      setIsLoading(false);
      return;
    }

    const options = { method: 'DELETE' };
    const response = await fetch(`/api/retweets/${retweetId}`, options);
    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  };

  return { removeRetweet, isLoading, error };
};
