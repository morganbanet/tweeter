import { useContext } from 'react';
import { SuggestionsContext } from '../../context/suggestions/SuggestionsContext';

const useSuggestionsContext = () => {
  const context = useContext(SuggestionsContext);

  if (!context) {
    throw new Error(
      'useSuggestionsContext must be used within SuggestionsProvider'
    );
  }

  return context;
};

export { useSuggestionsContext };
