import { useState } from 'react';
import { useAuthContext } from '../auth/useAuthContext';

export const useRemoveBookmark = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { userInfo } = useAuthContext();

  const removeBookmark = async (retweetId) => {
    setIsLoading(true);
    setError(null);

    if (!userInfo) {
      setError({ error: 'User must be authenticated' });
      setIsLoading(false);
      return;
    }

    const options = { method: 'DELETE' };
    const response = await fetch(`/api/bookmarks/${retweetId}`, options);
    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  };

  return { removeBookmark, isLoading, error };
};
