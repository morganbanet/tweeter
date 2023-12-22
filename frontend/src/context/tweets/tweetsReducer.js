const tweetsReducer = (state, action) => {
  switch (action.type) {
    case 'GET_TWEETS':
      return {
        tweets: action.payload.data,
      };
    case 'GET_TWEETS_NEXT':
      return {
        tweets: [...state.tweets, ...action.payload.data],
      };
    case 'CREATE_TWEET':
      return {
        tweets: [action.payload, ...state.tweets.slice(0, -1)],
      };
    case 'DELETE_TWEET':
      return {
        tweets: state.tweets.filter((tweet) => tweet._id !== action.payload),
      };
    default:
      return state;
  }
};

export default tweetsReducer;
