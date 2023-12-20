import { useState } from 'react';
import { useAuthContext } from '../auth/useAuthContext';
import { useTweetContext } from '../tweet/useTweetContext';

export const useCreateInteraction = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { userInfo } = useAuthContext();
  const { dispatch } = useTweetContext();

  // id - :tweetId / :commentId
  // pointA - tweets / comments
  // pointB = likes / retweets / bookmarks

  // ie: /api/tweets/:tweetId/likes
  // ie: /api/comments/:commentId/likes

  const createInteraction = async (id, pointA, pointB, type) => {
    setIsLoading(true);
    setError(null);

    if (!userInfo) {
      setError({ error: 'User must be authenticated' });
      setIsLoading(false);
      return;
    }

    const options = { method: 'POST' };

    const endpoint = `/api/${pointA}/${id}/${pointB}`;
    const response = await fetch(endpoint, options);
    const data = await response.json();

    if (!response) {
      setError(data.error);
      setIsLoading(false);
      return;
    }

    setData(data.data);

    dispatch({ type: `INCREMENT`, payload: type });

    setIsLoading(false);
  };

  return { createInteraction, data, isLoading, error };
};
