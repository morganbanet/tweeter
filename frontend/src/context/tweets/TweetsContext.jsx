import { createContext, useReducer } from 'react';
import tweetsReducer from './tweetsReducer';

const TweetsContext = createContext();

function TweetsProvider({ children }) {
  const initialState = {
    tweets: null,
  };

  const [state, dispatch] = useReducer(tweetsReducer, initialState);

  return (
    <TweetsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </TweetsContext.Provider>
  );
}

export { TweetsProvider, TweetsContext };
