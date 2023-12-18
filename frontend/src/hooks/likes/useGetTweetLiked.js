import { useState, useEffect } from 'react';
import { useAuthContext } from '../auth/useAuthContext';

export const useGetTweetLiked = (tweetId) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { userInfo } = useAuthContext();

  useEffect(() => {
    const getTweetLiked = async () => {
      setIsLoading(true);
      setError(null);

      if (!userInfo) {
        setError({ error: 'User must be authenticated' });
        setIsLoading(false);
        return;
      }

      const endpoint = `/api/likes?user[eq]=${userInfo._id}&liked[eq]=${tweetId}`;
      const response = await fetch(endpoint);
      const data = await response.json();

      // debug
      // console.log(data.data);

      if (!response.ok) {
        setError(data.error);
        setIsLoading(false);
        return;
      }

      data.data[0] ? setData(data.data[0]) : setData(null);

      setIsLoading(false);
    };

    getTweetLiked();
  }, []);

  return { data, isLoading, error };
};
