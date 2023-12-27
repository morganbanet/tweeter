const suggestionsReducer = (state, action) => {
  switch (action.type) {
    case 'GET_SUGGESTIONS':
      return {
        suggestions: action.payload,
      };

    default:
      return state;
  }
};

export default suggestionsReducer;
