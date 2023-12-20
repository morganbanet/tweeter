import { createContext, useReducer } from 'react';
import tweetReducer from './tweetReducer';

const TweetContext = createContext();

function TweetProvider({ children, tweet }) {
  tweet = tweet.retweeted || tweet;

  const initialState = {
    count: {
      commentCount: tweet.commentCount,
      retweetCount: tweet.retweetCount,
      likeCount: tweet.likeCount,
      bookmarkCount: tweet.bookmarkCount,
    },
  };

  const [state, dispatch] = useReducer(tweetReducer, initialState);

  return (
    <TweetContext.Provider value={{ ...state, dispatch }}>
      {children}
    </TweetContext.Provider>
  );
}

export { TweetProvider, TweetContext };
