const commentReducer = (state, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        count: {
          ...state.count,
          [`${action.payload}Count`]: state.count[`${action.payload}Count`] + 1,
        },
      };

    case 'DECREMENT':
      return {
        ...state,
        count: {
          ...state.count,
          [`${action.payload}Count`]: state.count[`${action.payload}Count`] - 1,
        },
      };

    default:
      return state;
  }
};

export default commentReducer;
