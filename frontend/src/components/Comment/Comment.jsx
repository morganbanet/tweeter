import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuthContext } from '../../hooks/auth/useAuthContext';

import InteractionButton from '../InteractionButton/InteractionButton';

import formatDate from '../../utils/formatDate';
import processText from '../../utils/processText';

function Comment({ tweet, comment }) {
  const [likeCount, setLikeCount] = useState(0);

  const { userInfo } = useAuthContext();

  useEffect(() => {
    setLikeCount(comment.likeCount);
  }, [comment._id]);

  return (
    <div className="tweet-comment">
      <div className="comment-avatar">
        <Link to={`/users/${comment.user.slug}/${comment.user._id}`}>
          <img
            src={comment.user.avatar?.url || userInfo.avatar.url}
            alt="user avatar"
          />
        </Link>
      </div>

      <div className="comment-area">
        <div className="comment-container">
          <div className="comment-info">
            <Link to={`/users/${comment.user.slug}/${comment.user._id}`}>
              {comment.user.name || userInfo.name}
            </Link>
            <span>{formatDate(comment.createdAt)}</span>
          </div>

          <p>{processText(comment.text)}</p>

          {comment.image && (
            <div className="comment-image">
              <img src={comment.image && comment.image.url} />
            </div>
          )}
        </div>

        <div className="comment-controls">
          <InteractionButton
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
