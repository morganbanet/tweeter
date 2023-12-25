import { createContext, useReducer } from 'react';
import interactionsReducer from './interactionsReducer';

const InteractionsContext = createContext();

function InteractionsProvider({ children }) {
  const initialState = {
    interactions: [],
    pagination: {
      prev: {
        page: 1,
        limit: 10,
      },
      current: {
        page: 1,
        limit: 10,
      },
      next: {
        page: 1,
        limit: 10,
      },
    },
  };

  const [state, dispatch] = useReducer(interactionsReducer, initialState);

  // console.log(state);

  return (
    <InteractionsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </InteractionsContext.Provider>
  );
}

export { InteractionsProvider, InteractionsContext };
