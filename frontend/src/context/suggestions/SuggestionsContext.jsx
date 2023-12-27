import { createContext, useReducer } from 'react';
import suggestionsReducer from './suggestionsReducer';

const SuggestionsContext = createContext();

function SuggestionsProvider({ children }) {
  const initialState = {
    suggestions: [],
  };

  const [state, dispatch] = useReducer(suggestionsReducer, initialState);

  return (
    <SuggestionsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </SuggestionsContext.Provider>
  );
}

export { SuggestionsProvider, SuggestionsContext };
