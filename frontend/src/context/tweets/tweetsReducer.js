const tweetsReducer = (state, action) => {
  switch (action.type) {
    case 'GET_TWEETS':
      return {
        tweets: action.payload.data,
        pagination: action.payload.pagination,
      };
    case 'GET_TWEETS_NEXT':
      return {
        tweets: [...state.tweets, ...action.payload.data],
        pagination: action.payload.pagination,
      };
    case 'CREATE_TWEET':
      return {
        ...state,
        tweets: [action.payload, ...state.tweets.slice(0, -1)],
      };
    case 'DELETE_TWEET':
      // fetch the first item on the next page and append it as the last
      // item on the current page to fill in the gap
      return {
        ...state,
        tweets: state.tweets.filter((tweet) => tweet._id !== action.payload),
      };
    default:
      return state;
  }
};

export default tweetsReducer;
