import { useState, useEffect } from 'react';
import { useAuthContext } from '../auth/useAuthContext';
import { useHashtagsContext } from '../hashtags/useHashtagsContext';

export const useGetTrending = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { userInfo } = useAuthContext();
  const { dispatch } = useHashtagsContext();

  useEffect(() => {
    const getTrending = async () => {
      setIsLoading(true);
      setError(null);

      if (!userInfo) {
        setError({ error: 'User must be authenticated' });
        setIsLoading(false);
        return;
      }

      const endpoint = `/api/hashtags?targetType[eq]=Tweet&sort=-count&limit=6`;
      const response = await fetch(endpoint);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        setIsLoading(false);
        return;
      }

      dispatch({ type: 'GET_HASHTAGS', payload: data.data });

      setIsLoading(false);
    };

    getTrending();
  }, []);

  return { isLoading, error };
};
