import { createContext, useReducer } from 'react';
import authReducer from './authReducer';

const AuthContext = createContext();

function AuthProvider({ children }) {
  // check if user is already in local storage
  let userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;

  // remove user from localstorage if timestamp expired
  if (userInfo && Date.now() > userInfo.timestamp) {
    localStorage.clear();
    userInfo = null;
  }

  const initialState = {
    userInfo,
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext };
