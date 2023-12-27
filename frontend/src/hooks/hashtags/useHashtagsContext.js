import { useContext } from 'react';
import { HashtagsContext } from '../../context/hashtags/HashtagsContext';

const useHashtagsContext = () => {
  const context = useContext(HashtagsContext);

  if (!context) {
    throw new Error('useHashtagsContext must be used within HashtagsProvider');
  }

  return context;
};

export { useHashtagsContext };
