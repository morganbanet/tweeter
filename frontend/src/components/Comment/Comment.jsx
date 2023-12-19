import { useEffect, useState } from 'react';
import { useAuthContext } from '../../hooks/auth/useAuthContext';
import formatDate from '../../utils/formatDate';
import TweetInteractionButton from '../TweetInteractionButton/TweetInteractionButton';

function Comment({ tweet, comment }) {
  const [likeCount, setLikeCount] = useState(0);

  const { userInfo } = useAuthContext();

  useEffect(() => {
    setLikeCount(comment.likeCount);
  }, [comment._id]);

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
            <p>{comment.user.name || userInfo.name}</p>
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
          <TweetInteractionButton
            resource={comment}
            count={likeCount}
            setCount={setLikeCount}
            resType={'comments'}
            btnType={'like'}
            targetOne={'likes'}
            targetTwo={'liked'}
            symbol={'favorite'}
          />

          {likeCount > 0 && (
            <div className="like-info">
              <span>·</span>
              <span>{likeCount} Likes</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Comment;
