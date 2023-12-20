import { useContext } from 'react';
import { CommentsContext } from '../../context/comments/CommentsContext';

const useCommentsContext = () => {
  const context = useContext(CommentsContext);

  if (!context) {
    throw new Error('useCommentsContext must be used within CommentsProvider');
  }

  return context;
};

export { useCommentsContext };
