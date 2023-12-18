import { useState } from 'react';
import { useAuthContext } from '../auth/useAuthContext';
import { useTweetsContext } from './useTweetsContext';

export const useCreateTweet = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { userInfo } = useAuthContext();
  const { dispatch } = useTweetsContext();

  const createTweet = async (text, file, isPrivate) => {
    setIsLoading(true);
    setError(null);

    if (!userInfo) {
      setError({ error: 'User must be authenticated' });
      setIsLoading(false);
      return;
    }

    // multipart/form-data
    const formData = new FormData();
    formData.append('text', text);
    formData.append('private', isPrivate);
    if (file) formData.append('file', file);

    const options = {
      method: 'POST',
      body: formData,
    };

    const response = await fetch('/api/tweets', options);
    const data = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(data.error);
      return;
    }

    dispatch({ type: 'CREATE_TWEET', payload: data.data });

    setIsLoading(false);
    setError(null);
  };

  return { createTweet, isLoading, error };
};
