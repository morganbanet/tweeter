import { useEffect, useState } from 'react';
import { useTweetsContext } from './useTweetsContext';

export const useGetTweets = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { dispatch } = useTweetsContext();

  useEffect(() => {
    const getTweets = async () => {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/tweets?limit=10');
      const data = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        setError(data.error);
        return;
      }

      dispatch({ type: 'GET_TWEETS', payload: data.data });

      setIsLoading(false);
    };

    getTweets();
  }, []);

  return { isLoading, error };
};
