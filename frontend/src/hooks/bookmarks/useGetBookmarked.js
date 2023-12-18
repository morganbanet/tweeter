import { useState, useEffect } from 'react';
import { useAuthContext } from '../auth/useAuthContext';

export const useGetBookmarked = (tweetId) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { userInfo } = useAuthContext();

  useEffect(() => {
    const getBookmarked = async () => {
      setIsLoading(true);
      setError(null);

      if (!userInfo) {
        setError({ error: 'User must be authenticated' });
        setIsLoading(false);
        return;
      }

      const endpoint = `/api/bookmarks?user[eq]=${userInfo._id}&bookmarked[eq]=${tweetId}`;
      const response = await fetch(endpoint);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        setIsLoading(false);
        return;
      }

      data.data[0] ? setData(data.data[0]) : setData(null);

      setIsLoading(false);
    };

    getBookmarked();
  }, []);

  return { data, isLoading, error };
};
