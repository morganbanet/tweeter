import { useState, useEffect } from 'react';
import { useAuthContext } from '../auth/useAuthContext';
import { useSuggestionsContext } from '../suggestions/useSuggestionsContext';

export const useGetSuggestions = (sort = '-createdAt') => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { userInfo } = useAuthContext();
  const { dispatch } = useSuggestionsContext();

  useEffect(() => {
    const getSuggestions = async () => {
      setIsLoading(true);
      setError(null);

      if (!userInfo) {
        setError({ error: 'User must be authenticated' });
        setIsLoading(false);
        return;
      }

      const endpoint = `/api/users?sort=${sort}`;
      const response = await fetch(endpoint);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        setIsLoading(false);
        return;
      }

      dispatch({ type: 'GET_SUGGESTIONS', payload: data.data });

      setIsLoading(false);
    };

    getSuggestions();
  }, []);

  return { isLoading, error };
};
