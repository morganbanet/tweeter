import { useAuthContext } from '../../hooks/auth/useAuthContext';
import formatDate from '../../utils/formatDate';

function Comment({ tweet, comment }) {
  const { userInfo } = useAuthContext();

  return (
    <div className="tweet-comment">
      <div className="comment-avatar">
        <img
          src={comment.user.avatar?.url || userInfo.avatar.url}
          alt="user avatar"
        />
      </div>

      <div className="comment-area">
        <div className="comment-container">
          <div className="comment-info">
            <p>{comment.user.name}</p>
            <span>{formatDate(comment.createdAt)}</span>
          </div>

          <p>{comment.text}</p>

          {comment.image && (
            <div className="comment-image">
              <img src={comment.image && comment.image.url} />
            </div>
          )}
        </div>

        <div className="comment-controls">
          <div className="like-btn">
            <span className="material-symbols-outlined">favorite</span>
            <p>Like</p>
          </div>

          {comment.likeCount > 0 && (
            <div className="like-info">
              <span>·</span>
              <span>{comment.likeCount} Likes</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Comment;
