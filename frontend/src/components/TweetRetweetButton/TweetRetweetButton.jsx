import { useState, useEffect } from 'react';
import { useGetRetweeted } from '../../hooks/retweets/useGetRetweeted';
import { useRetweetTweet } from '../../hooks/retweets/useRetweetTweet';
import { useRemoveRetweet } from '../../hooks/retweets/useRemoveRetweet';

function TweetRetweetButton({ tweet, retweetCount, setRetweetCount }) {
  const [retweet, setRetweet] = useState(null);
  const [isRetweeted, setIsRetweeted] = useState(false);

  const { data: retweetedData } = useGetRetweeted(tweet._id);
  const { retweetTweet, data: retweetData } = useRetweetTweet(tweet._id);
  const { removeRetweet } = useRemoveRetweet();

  useEffect(() => {
    retweetedData && setRetweet(retweetedData);
    retweetData && setRetweet(retweetData);
    (retweetData || retweetedData) && setIsRetweeted(true);
  }, [retweetedData, retweetData]);
  useEffect(() => setRetweetCount(tweet.retweetCount), [tweet._id]);

  const handleRetweetTweet = () => {
    if (isRetweeted) {
      removeRetweet(retweet._id);
      setRetweet(null);
      setIsRetweeted(false);
      setRetweetCount(retweetCount - 1);
    }

    if (!isRetweeted) {
      retweetTweet(tweet._id);
      setRetweet(retweetData);
      setIsRetweeted(true);
      setRetweetCount(retweetCount + 1);
    }
  };

  return (
    <div
      onClick={() => handleRetweetTweet()}
      className={isRetweeted ? 'retweeted-tweet' : ''}
    >
      <span className={`material-symbols-outlined sync`}>sync</span>
      {isRetweeted ? <p>Retweeted</p> : <p>Retweet</p>}
    </div>
  );
}

export default TweetRetweetButton;
