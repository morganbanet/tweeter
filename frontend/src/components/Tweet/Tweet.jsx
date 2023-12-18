import { useState, useEffect } from 'react';
import { useAuthContext } from '../../hooks/auth/useAuthContext';
import { useGetComments } from '../../hooks/comments/useGetComments';
import CommentForm from '../CommentForm/CommentForm';
import Comment from '../Comment/Comment';
import formatDate from '../../utils/formatDate';

function Tweet({ tweet }) {
  const [formIsOpen, setFormIsOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);

  const { getComments, data, isLoading, error } = useGetComments();
  const { userInfo } = useAuthContext();

  const retweet = tweet.retweeted ? tweet.retweeted : null;
  tweet = tweet.retweeted || tweet;

  useEffect(() => {
    setCommentCount(tweet.commentCount);
    const fetchData = async () => await getComments(tweet._id);
    fetchData();
  }, []);

  useEffect(() => setComments(data), [data]);

  const handleCreateComment = (comment) => {
    setComments([comment, ...comments]);
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
          {tweet.retweetCount > 0 && <span>{tweet.retweetCount} Retweets</span>}
          {tweet.likeCount > 0 && <span>{tweet.likeCount} Likes</span>}
        </div>

        <div className="tweet-controls">
          <div onClick={() => setFormIsOpen(!formIsOpen)}>
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
