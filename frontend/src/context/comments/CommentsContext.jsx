import { createContext, useReducer } from 'react';
import commentsReducer from './commentsReducer';

const CommentsContext = createContext();

function CommentsProvider({ children }) {
  const initialState = {
    comments: [],
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

  const [state, dispatch] = useReducer(commentsReducer, initialState);

  return (
    <CommentsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </CommentsContext.Provider>
  );
}

export { CommentsProvider, CommentsContext };
