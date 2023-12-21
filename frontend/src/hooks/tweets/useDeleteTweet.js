import { useState } from 'react';
import { useAuthContext } from '../auth/useAuthContext';
import { useTweetsContext } from './useTweetsContext';

export const useDeleteTweet = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { userInfo } = useAuthContext();
  const { dispatch } = useTweetsContext();

  const deleteTweet = async (tweetId) => {
    setIsLoading(true);
    setError(null);

    if (!userInfo) {
      setError({ error: 'User must be authenticated' });
      setIsLoading(false);
      return;
    }

    const options = { method: 'DELETE' };
    const response = await fetch(`/api/tweets/${tweetId}`, options);
    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
      setIsLoading(false);
      return;
    }

    dispatch({ type: 'DELETE_TWEET', payload: tweetId });

    setIsLoading(false);
  };

  return { deleteTweet, isLoading, error };
};
