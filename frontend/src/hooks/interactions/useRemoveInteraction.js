import { useState } from 'react';
import { useAuthContext } from '../auth/useAuthContext';
import { useTweetContext } from '../tweet/useTweetContext';

// collection - likes / retweets / bookmarks
// resourceId - likeId / retweetId / bookmarkId

// ie: /api/likes/:likeId

export const useRemoveInteraction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { userInfo } = useAuthContext();
  const { dispatch } = useTweetContext();

  const removeInteraction = async (id, pointA, type) => {
    setIsLoading(true);
    setError(null);

    if (!userInfo) {
      setError({ error: 'User must be authenticated' });
      setIsLoading(false);
      return;
    }

    const options = { method: 'DELETE' };
    const response = await fetch(`/api/${pointA}/${id}`, options);
    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
      setIsLoading(false);
      return;
    }

    dispatch({ type: `DECREMENT`, payload: type });

    setIsLoading(false);
  };

  return { removeInteraction, isLoading, error };
};
