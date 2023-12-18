import { useState, useEffect } from 'react';
import { useAuthContext } from '../auth/useAuthContext';

export const useGetRetweeted = (tweetId) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { userInfo } = useAuthContext();

  useEffect(() => {
    const getRetweeted = async () => {
      setIsLoading(true);
      setError(null);

      if (!userInfo) {
        setError({ error: 'User must be authenticated' });
        setIsLoading(false);
        return;
      }

      const endpoint = `/api/retweets?user[eq]=${userInfo._id}&retweeted[eq]=${tweetId}`;
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

    getRetweeted();
  }, []);

  return { data, isLoading, error };
};
