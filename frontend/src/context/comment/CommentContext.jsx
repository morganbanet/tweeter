import { createContext, useReducer } from 'react';
import commentReducer from './commentReducer';

const CommentContext = createContext();

function CommentProvider({ children, comment }) {
  const initialState = {
    count: {
      likeCount: comment.likeCount,
    },
  };

  const [state, dispatch] = useReducer(commentReducer, initialState);

  return (
    <CommentContext.Provider value={{ ...state, dispatch }}>
      {children}
    </CommentContext.Provider>
  );
}

export { CommentProvider, CommentContext };
