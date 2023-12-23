import { useState } from 'react';
import { useAuthContext } from '../auth/useAuthContext';
import { useTweetsContext } from './useTweetsContext';

export const useDeleteTweet = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { userInfo } = useAuthContext();
  const { dispatch, pagination } = useTweetsContext();

  const deleteTweet = async (tweetId) => {
    setIsLoading(true);
    setError(null);

    if (!userInfo) {
      setError({ error: 'User must be authenticated' });
      setIsLoading(false);
      return;
    }

    const options = { method: 'DELETE' };
    const deleteResponse = await fetch(`/api/tweets/${tweetId}`, options);
    const deleteData = await deleteResponse.json();

    if (!deleteResponse.ok) {
      setError(deleteData.error);
      setIsLoading(false);
      return;
    }

    // get tweet which now takes the last index on curr page after a del
    const page = pagination.current.page * 10;
    const getResponse = await fetch(`/api/tweets?page=${page}&limit=1`);
    const getData = await getResponse.json();

    if (!getResponse.ok) {
      setError(getData.error);
      setIsLoading(false);
      return;
    }

    const payload = { tweetId, toAppend: getData.data };
    dispatch({ type: 'DELETE_TWEET', payload });

    setIsLoading(false);
  };

  return { deleteTweet, isLoading, error };
};
