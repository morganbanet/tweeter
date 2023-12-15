const tweetsReducer = (state, action) => {
  switch (action.type) {
    case 'GET_TWEETS':
      return {
        tweets: action.payload,
      };
    case 'CREATE_TWEET':
      return {
        tweets: [action.payload, ...state.tweets],
      };
    case 'DELETE_TWEET':
      return {
        tweets: state.tweets.filter(
          (tweet) => tweet._id !== action.payload._id
        ),
      };
    default:
      return state;
  }
};

export default tweetsReducer;
