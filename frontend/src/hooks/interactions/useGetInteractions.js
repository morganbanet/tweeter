import { useState } from 'react';
import { useInteractionsContext } from './useInteractionsContext';

export const useGetInteractions = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { dispatch } = useInteractionsContext();

  const getInteractions = async (id, pointA, pointB, page = 1) => {
    const endpoint = `/api/${pointA}/${id}/${pointB}/users?page=${page}&limit=10&sort=createdAt`;
    const response = await fetch(endpoint);
    const data = await response.json();

    // debug
    // console.log(data);

    if (!response.ok) {
      setError(data.error);
      setIsLoading(false);
      return;
    }

    dispatch({
      type: page < 2 ? 'GET_INTERACTIONS' : 'GET_INTERACTIONS_NEXT',
      payload: data,
    });

    setError(null);
    setIsLoading(false);
  };

  return { getInteractions, isLoading, error };
};
