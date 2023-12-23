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
      let tweetsAtCreate;
      let nextPage;

      if (state.tweets.length % 10 === 0) {
        tweetsAtCreate = [action.payload, ...state.tweets.slice(0, -1)];
        nextPage = state.pagination.current.page + 1;
      } else {
        tweetsAtCreate = [action.payload, ...state.tweets];
      }

      return {
        tweets: tweetsAtCreate,
        pagination: { ...state.pagination, next: { page: nextPage } },
      };

    case 'DELETE_TWEET':
      const currPage =
        state.tweets.length % 10 === 1
          ? state.pagination.current.page - 1
          : state.pagination.current.page;

      const tweetsAtDelete = [
        ...state.tweets.filter((tweet) => tweet._id !== action.payload.tweetId),
        ...action.payload.toAppend,
      ];

      return {
        tweets: tweetsAtDelete,
        pagination: { ...state.pagination, current: { page: currPage } },
      };

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
