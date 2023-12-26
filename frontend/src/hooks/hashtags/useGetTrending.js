import { useState, useEffect } from 'react';
import { useAuthContext } from '../auth/useAuthContext';

export const useGetTrending = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { userInfo } = useAuthContext();

  useEffect(() => {
    const getTrending = async () => {
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

      setData(data.data);
      setIsLoading(false);
    };

    getTrending();
  }, []);

  return { data, isLoading, error };
};
