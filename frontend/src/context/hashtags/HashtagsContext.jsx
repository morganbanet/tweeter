import { createContext, useReducer } from 'react';
import hashtagsReducer from './hashtagsReducer';

const HashtagsContext = createContext();

function HashtagsProvider({ children }) {
  const initialState = {
    hashtags: [],
  };

  const [state, dispatch] = useReducer(hashtagsReducer, initialState);

  return (
    <HashtagsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </HashtagsContext.Provider>
  );
}

export { HashtagsProvider, HashtagsContext };
