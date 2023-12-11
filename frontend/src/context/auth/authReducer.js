const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_USER':
      return {
        userInfo: action.payload,
      };
    case 'LOGOUT_USER':
      return {
        userInfo: null,
      };
    default: {
      return state;
    }
  }
};

export default authReducer;
