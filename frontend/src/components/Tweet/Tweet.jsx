import { useState, useEffect } from 'react';
import { useAuthContext } from '../../hooks/auth/useAuthContext';
import { useGetComments } from '../../hooks/comments/useGetComments';
import TweetLikeButton from '../TweetLikeButton/TweetLikeButton';
import TweetRetweetButton from '../TweetRetweetButton/TweetRetweetButton';
import TweetBookmarkButton from '../TweetBookmarkButton/TweetBookmarkButton';
import CommentForm from '../CommentForm/CommentForm';
import Comment from '../Comment/Comment';
import formatDate from '../../utils/formatDate';

function Tweet({ tweet }) {
  const [commentCount, setCommentCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [retweetCount, setRetweetCount] = useState(0);
  const [bookmarkCount, setBookmarkCount] = useState(0);

  const [comments, setComments] = useState([]);
  const [formIsOpen, setFormIsOpen] = useState(false);

  const retweet = tweet.retweeted ? tweet.retweeted : null;
  tweet = tweet.retweeted || tweet;

  const { userInfo } = useAuthContext();
  const { data, isLoading, error } = useGetComments(tweet._id);

  useEffect(() => {
    setCommentCount(tweet.commentCount);
    setLikeCount(tweet.likeCount);
    setRetweetCount(tweet.retweetCount);
    setBookmarkCount(tweet.bookmarkCount);

    setComments(data);
  }, [tweet._id, data]);

  const handleCreateComment = (comment) => {
    setComments((comments) => [comment, ...comments]);
    setCommentCount(commentCount + 1);
  };

  return (
    <div className="tweet-container">
      {retweet && (
        <div className="retweet-info">
          <span className="material-symbols-outlined">sync</span>
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
          {commentCount > 0 && <span>{commentCount} Comments</span>}
          {retweetCount > 0 && <span>{retweetCount} Retweets</span>}
          {likeCount > 0 && <span>{likeCount} Likes</span>}
          {bookmarkCount > 0 && <span>{bookmarkCount} Saved</span>}
        </div>

        <div className="tweet-controls">
          <div onClick={() => setFormIsOpen(!formIsOpen)}>
            <span className="material-symbols-outlined">mode_comment</span>
            <p>Comment</p>
          </div>

          <TweetRetweetButton
            tweet={tweet}
            retweetCount={retweetCount}
            setRetweetCount={setRetweetCount}
          />

          <TweetLikeButton
            tweet={tweet}
            likeCount={likeCount}
            setLikeCount={setLikeCount}
          />

          <TweetBookmarkButton
            tweet={tweet}
            bookmarkCount={bookmarkCount}
            setBookmarkCount={setBookmarkCount}
          />
        </div>

        {formIsOpen && (
          <CommentForm
            tweet={tweet}
            handleCreateComment={handleCreateComment}
          />
        )}

        {comments.map((comment) => (
          <Comment key={comment._id} tweet={tweet} comment={comment} />
        ))}
      </div>
    </div>
  );
}

export default Tweet;
