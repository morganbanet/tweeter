import { useEffect, useState } from 'react';
import { useTweetsContext } from './useTweetsContext';

export const useGetTweets = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { dispatch } = useTweetsContext();

  const getTweets = async (page = 1, limit = 10) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(`/api/tweets?page=${page}}&limit=${limit}`);
    const data = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(data.error);
      return;
    }

    dispatch({
      type: page < 2 ? 'GET_TWEETS' : 'GET_TWEETS_NEXT',
      payload: data,
    });

    setIsLoading(false);
  };

  return { getTweets, isLoading, error };
};
