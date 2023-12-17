import { useAuthContext } from '../../hooks/auth/useAuthContext';
import CommentForm from '../CommentForm/CommentForm';
import Comment from '../Comment/Comment';

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
          <span class="material-symbols-outlined">sync</span>
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
          {tweet.commentCount > 0 && <span>{tweet.commentCount} Comments</span>}
          {tweet.retweetCount > 0 && <span>{tweet.retweetCount} Retweets</span>}
          {tweet.likeCount > 0 && <span>{tweet.likeCount} Likes</span>}
        </div>

        <div className="tweet-controls">
          <div>
            <span className="material-symbols-outlined">mode_comment</span>
            <p>Comment</p>
          </div>

          <div>
            <span className="material-symbols-outlined sync">sync</span>
            <p>Retweet</p>
          </div>

          <div>
            <span className="material-symbols-outlined">favorite</span>
            <p>Like</p>
          </div>

          <div>
            <span className="material-symbols-outlined">bookmark</span>
            <p>Save</p>
          </div>
        </div>

        <CommentForm />

        <Comment tweet={tweet} />
      </div>
    </div>
  );
}

export default Tweet;
