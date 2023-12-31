import { useState } from 'react';
import { useTweetsContext } from './useTweetsContext';

export const useFilterTweets = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { dispatch } = useTweetsContext();

  const filterTweets = async (filters, page = 1) => {
    setIsLoading(true);
    setError(null);

    const { sort, eq } = filters;

    let endpoint = `/api/tweets/filter?page=${page}&limit=10`;

    if (sort === 'top') {
      endpoint = `${endpoint}&sort=-likeCount,-createdAt`;
    }

    if (eq === 'media') {
      endpoint = `${endpoint}&image[exists]=true&sort=-createdAt`;
    }

    // const endpoint = `/api/tweets?page=${page}&limit=10&sort=${sort}`;
    const response = await fetch(endpoint);
    const data = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(data.error);
      return;
    }

    dispatch({
      type: page < 2 ? 'GET_TWEETS' : 'GET_TWEETS_NEXT',
      payload: data,
    });

    setIsLoading(false);
  };

  return { filterTweets, isLoading, error };
};
