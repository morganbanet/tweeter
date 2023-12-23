import { createContext, useReducer } from 'react';
import tweetsReducer from './tweetsReducer';

const TweetsContext = createContext();

function TweetsProvider({ children }) {
  const initialState = {
    tweets: [],
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

  const [state, dispatch] = useReducer(tweetsReducer, initialState);

  // console.log('context state:', state.pagination.current.page);

  return (
    <TweetsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </TweetsContext.Provider>
  );
}

export { TweetsProvider, TweetsContext };
