import { useState } from 'react';
import { useAuthContext } from '../auth/useAuthContext';

// collection - likes / retweets / bookmarks
// resourceId - likeId / retweetId / bookmarkId

// ie: /api/likes/:likeId

export const useRemoveInteraction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { userInfo } = useAuthContext();

  const removeInteraction = async (id, pointA) => {
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

    setIsLoading(false);
  };

  return { removeInteraction, isLoading, error };
};
