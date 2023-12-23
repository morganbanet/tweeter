import { useState } from 'react';
import { useCommentsContext } from './useCommentsContext';

export const useGetComments = (tweetId) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { dispatch } = useCommentsContext();

  const getComments = async (page = 1) => {
    setIsLoading(true);
    setError(null);

    const endpoint = `/api/tweets/${tweetId}/comments?page=${page}&limit=5`;
    const response = await fetch(endpoint);
    const data = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(data.error);
      return;
    }

    dispatch({
      type: page < 2 ? 'GET_COMMENTS' : 'GET_COMMENTS_NEXT',
      payload: data,
    });

    setIsLoading(false);
  };

  return { getComments, isLoading, error };
};
