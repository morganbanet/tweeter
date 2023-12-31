import { useState, useEffect } from 'react';
import { useAuthContext } from '../auth/useAuthContext';

export const useGetFollows = (userId, returnIdsOnly = false) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { userInfo } = useAuthContext();

  useEffect(() => {
    const getFollows = async () => {
      setIsLoading(true);
      setError(null);

      if (!userInfo) {
        setError({ error: 'User must be authenticated' });
        setIsLoading(false);
        return;
      }

      const endpoint = `/api/users/${userId}/follows/followers`;
      const response = await fetch(endpoint);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        setIsLoading(false);
        return;
      }

      const users = returnIdsOnly
        ? data.data.map((follow) => follow.user._id)
        : null;

      setData(returnIdsOnly ? users : data.data);

      setIsLoading(false);
    };

    getFollows();
  }, []);

  return { data, isLoading, error };
};
