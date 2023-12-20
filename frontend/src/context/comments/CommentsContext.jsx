import { createContext, useReducer } from 'react';
import commentsReducer from './commentsReducer';

const CommentsContext = createContext();

function CommentsProvider({ children }) {
  const initialState = {
    comments: [],
  };

  const [state, dispatch] = useReducer(commentsReducer, initialState);

  return (
    <CommentsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </CommentsContext.Provider>
  );
}

export { CommentsProvider, CommentsContext };
