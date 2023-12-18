import { useState, useEffect } from 'react';

export const useGetTweetLikes = (tweetId) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTweetLikes = async () => {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/tweets/${tweetId}/likes`);
      const data = await response.json();

      // debug
      // console.log(data);

      if (!response.ok) {
        setError(data.error);
        setIsLoading(false);
        return;
      }

      setData(data.data);
      setIsLoading(false);
    };

    getTweetLikes();
  }, []);

  return { data, isLoading, error };
};
