import { useState } from 'react';
import { useAuthContext } from '../auth/useAuthContext';
import { useCommentsContext } from './useCommentsContext';

export const useDeleteComment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { userInfo } = useAuthContext();
  const { dispatch } = useCommentsContext();

  const deleteComment = async (commentId) => {
    setIsLoading(true);
    setError(null);

    if (!userInfo) {
      setError({ error: 'User must be authenticated' });
      setIsLoading(false);
      return;
    }

    const options = { method: 'DELETE' };
    const response = await fetch(`/api/comments/${commentId}`, options);
    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
      setIsLoading(false);
      return;
    }

    dispatch({ type: 'DELETE_COMMENT', payload: commentId });

    setIsLoading(false);
  };

  return { deleteComment, isLoading, error };
};
