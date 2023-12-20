import { useContext } from 'react';
import { TweetContext } from '../../context/tweet/TweetContext';

const useTweetContext = () => {
  const context = useContext(TweetContext);

  if (!context) {
    throw new Error('useTweetContext must be used within TweetProvider');
  }

  return context;
};

export { useTweetContext };
