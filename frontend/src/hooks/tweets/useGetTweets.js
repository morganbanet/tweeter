import { useState } from 'react';
import { useTweetsContext } from './useTweetsContext';

export const useGetTweets = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { dispatch } = useTweetsContext();

  const getTweets = async (page = 1) => {
    setError(null);

    const endpoint = `/api/tweets?page=${page}&limit=10`;
    const response = await fetch(endpoint);
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
