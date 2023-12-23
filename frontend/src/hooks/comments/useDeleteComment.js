import { useState } from 'react';
import { useAuthContext } from '../auth/useAuthContext';
import { useTweetContext } from '../tweet/useTweetContext';
import { useCommentsContext } from './useCommentsContext';

export const useDeleteComment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { dispatch: tweetDispatch } = useTweetContext();
  const { dispatch, pagination } = useCommentsContext();
  const { userInfo } = useAuthContext();

  const deleteComment = async (tweetId, commentId) => {
    setIsLoading(true);
    setError(null);

    if (!userInfo) {
      setError({ error: 'User must be authenticated' });
      setIsLoading(false);
      return;
    }

    const options = { method: 'DELETE' };
    const deleteResponse = await fetch(`/api/comments/${commentId}`, options);
    const deleteData = await deleteResponse.json();

    if (!deleteResponse.ok) {
      setError(deleteData.error);
      setIsLoading(false);
      return;
    }

    // get tweet which now takes the last index on curr page after a del
    const page = pagination.current.page * 5;
    const endpoint = `/api/tweets/${tweetId}/comments?page=${page}&limit=1`;
    const getResponse = await fetch(endpoint);
    const getData = await getResponse.json();

    if (!getResponse.ok) {
      setError(getData.error);
      setIsLoading(false);
      return;
    }

    const payload = { commentId, toAppend: getData.data };
    dispatch({ type: 'DELETE_COMMENT', payload });
    tweetDispatch({ type: 'DECREMENT', payload: 'comment' });

    setIsLoading(false);
  };

  return { deleteComment, isLoading, error };
};
