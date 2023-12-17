const commentsReducer = (state, action) => {
  switch (action.type) {
    case 'GET_COMMENTS':
      return {
        comments: action.payload,
      };
    case 'CREATE_COMMENT':
      return {
        comments: [action.payload, ...state.comments],
      };
    case 'DELETE_COMMENTS':
      return {
        comments: state.comments.filter(
          (comment) => comment._id !== action.payload._id
        ),
      };
    default: {
      return state;
    }
  }
};

export default commentsReducer;
