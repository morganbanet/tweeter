import { useContext } from 'react';
import { InteractionsContext } from '../../context/interactions/InteractionsContext';

const useInteractionsContext = () => {
  const context = useContext(InteractionsContext);

  if (!context) {
    throw new Error(
      'useInteractionsContext must be used within TweetsProvider'
    );
  }

  return context;
};

export { useInteractionsContext };
