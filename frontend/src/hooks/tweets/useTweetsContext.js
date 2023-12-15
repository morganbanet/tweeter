import { useContext } from 'react';
import { TweetsContext } from '../../context/tweets/TweetsContext';

const useTweetsContext = () => {
  const context = useContext(TweetsContext);

  if (!context) {
    throw new Error('useTweetsContext must be used within TweetsProvider');
  }

  return context;
};

export { useTweetsContext };
