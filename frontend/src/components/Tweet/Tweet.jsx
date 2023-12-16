import { useAuthContext } from '../../hooks/auth/useAuthContext';

function Tweet({ tweet }) {
  const { userInfo } = useAuthContext();

  const retweet = tweet.retweeted ? tweet.retweeted : null;
  tweet = tweet.retweeted || tweet;

  const formatDate = (val) => {
    const date = new Date(val);

    const options = {
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    };

    return date.toLocaleString('en-GB', options).split(',').join(' at');
  };

  return (
    <div className="tweet-container">
      {retweet && (
        <div className="retweet-info">
          <i className="fa-solid fa-rotate" />
          <p>{retweet.user.name} Retweeted</p>
        </div>
      )}

      <div className="tweet-container-inner">
        <div className="user-info">
          <div className="tweet-avatar">
            <img
              src={tweet.user.avatar?.url || userInfo.avatar.url}
              alt="user avatar"
            />
          </div>

          <div className="tweet-user-date">
            <p>{tweet.user.name}</p>
            <span>{formatDate(tweet.createdAt)}</span>
          </div>
        </div>

        <div className="tweet-body">
          <p>{tweet.text}</p>

          {tweet.image && (
            <div className="tweet-image">
              <img src={tweet.image && tweet.image.url} />
            </div>
          )}
        </div>

        <div className="tweet-stats">
          <span>449 Comments</span>
          <span>59K Retweets</span>
          <span>234 Saved</span>
        </div>
      </div>
    </div>
  );
}

export default Tweet;
