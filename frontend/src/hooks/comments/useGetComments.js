import { useState, useEffect } from 'react';

export const useGetComments = (tweetId) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getComments = async () => {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/tweets/${tweetId}/comments?limit=5`);
      const data = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        setError(data.error);
        return;
      }

      setData(data.data);
      setIsLoading(false);
    };

    getComments();
  }, [tweetId]);

  return { data, isLoading, error };
};
