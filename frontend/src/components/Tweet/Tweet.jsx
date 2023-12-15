function Tweet({ tweet }) {
  const retweet = tweet.retweeted ? tweet.retweeted : null;
  tweet = tweet.retweeted || tweet;

  return (
    <div className="tweet-container">
      {retweet && (
        <div className="retweet-info">
          <i className="fa-solid fa-rotate" />
          <p>{retweet.user.name} Retweeted</p>
        </div>
      )}

      <div className="tweet-container-inner">
        <p>{tweet.text}</p>
      </div>
    </div>
  );
}

export default Tweet;
