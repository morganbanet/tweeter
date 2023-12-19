import { useState, useEffect } from 'react';
import { useAuthContext } from '../auth/useAuthContext';

// id - :tweetId | :commentId
// pointA (collection) - likes | retweets | bookmarks
// pointB - liked | retweeted | bookmarked

// ie: /api/retweets?user[eq]=:userId&retweeted[eq]=:tweetId
// ie: /api/retweets?user[eq]=:userId&retweeted[eq]=:commentId

export const useGetInteracted = (id, pointA, pointB) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { userInfo } = useAuthContext();

  useEffect(() => {
    const getInteracted = async () => {
      setIsLoading(true);
      setError(null);

      if (!userInfo) {
        setError({ error: 'User must be authenticated' });
        setIsLoading(false);
        return;
      }

      const endpoint = `/api/${pointA}?${pointB}[eq]=${id}&user[eq]=${userInfo._id}`;
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

    getInteracted();
  }, []);

  return { data, isLoading, error };
};
