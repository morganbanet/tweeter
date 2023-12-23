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
      return {
        ...state,
        tweets: [
          ...state.tweets.filter(
            (tweet) => tweet._id !== action.payload.tweetId
          ),
          ...action.payload.toAppend,
        ],
      };

    default:
      return state;
  }
};

export default tweetsReducer;
