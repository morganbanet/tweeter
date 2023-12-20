import { useState, useEffect } from 'react';
import { useCommentsContext } from './useCommentsContext';

export const useGetComments = (tweetId) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { dispatch } = useCommentsContext();

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

      dispatch({ type: 'GET_COMMENTS', payload: data.data });

      setIsLoading(false);
    };

    getComments();
  }, []);

  return { isLoading, error };
};
