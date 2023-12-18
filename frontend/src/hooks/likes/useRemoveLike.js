import { useState, useEffect } from 'react';
import { useAuthContext } from '../auth/useAuthContext';

export const useRemoveLike = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { userInfo } = useAuthContext();

  const removeLike = async (likeId) => {
    setIsLoading(true);
    setError(null);

    if (!userInfo) {
      setError({ error: `User must be authenticated` });
      setIsLoading(false);
      return;
    }

    const options = { method: 'DELETE' };
    const response = await fetch(`/api/likes/${likeId}`, options);
    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  };

  return { removeLike, isLoading, error };
};
