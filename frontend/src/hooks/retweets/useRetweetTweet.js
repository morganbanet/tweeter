import { useState } from 'react';
import { useAuthContext } from '../auth/useAuthContext';

export const useRetweetTweet = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { userInfo } = useAuthContext();

  const retweetTweet = async (tweetId) => {
    setIsLoading(true);
    setError(null);

    if (!userInfo) {
      setError({ error: 'User must be authenticated' });
      setIsLoading(false);
      return;
    }

    const options = { method: 'POST' };
    const response = await fetch(`/api/tweets/${tweetId}/retweets`, options);
    const data = await response.json();

    if (!response) {
      setError(data.error);
      setIsLoading(false);
      return;
    }

    setData(data.data);

    setIsLoading(false);
  };

  return { retweetTweet, data, isLoading, error };
};
