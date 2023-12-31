import { useState } from 'react';
import { useInteractionsContext } from './useInteractionsContext';

export const useGetInteractions = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { dispatch } = useInteractionsContext();

  const getInteractions = async (id, pointA, pointB, page = 1) => {
    setIsLoading(true);
    setError(null);

    const endpoint = `/api/${pointA}/${id}/${pointB}/users?page=${page}&limit=10&sort=name`;
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

    setIsLoading(false);
  };

  return { getInteractions, isLoading, error };
};
