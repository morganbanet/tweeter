import { useState } from 'react';
import { useAuthContext } from '../auth/useAuthContext';

export const useCreateComment = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const { userInfo } = useAuthContext();

  const createComment = async (text, file, tweetId) => {
    setIsLoading(true);
    setError(null);

    if (!userInfo) {
      setError({ error: `User must be authenticated` });
      setIsLoading(false);
      return;
    }

    // multipart/form-data
    const formData = new FormData();
    formData.append('text', text);
    if (file) formData.append('file', file);

    const options = {
      method: 'POST',
      body: formData,
    };

    const response = await fetch(`/api/tweets/${tweetId}/comments`, options);
    const data = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(data.error);
      return;
    }

    setData(data.data);

    setIsLoading(false);
    setError(null);
  };

  return { createComment, data, isLoading, error };
};
