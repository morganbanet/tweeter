import { useContext } from 'react';
import { CommentContext } from '../../context/comment/CommentContext';

const useCommentContext = () => {
  const context = useContext(CommentContext);

  if (!context) {
    throw new Error('useCommentContext must be used within useCommentProvider');
  }

  return context;
};

export { useCommentContext };
