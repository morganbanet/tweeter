const hashtagsReducer = (state, action) => {
  switch (action.type) {
    case 'GET_HASHTAGS':
      return {
        hashtags: action.payload,
      };

    default:
      return state;
  }
};

export default hashtagsReducer;
