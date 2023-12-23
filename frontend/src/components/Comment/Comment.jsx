import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';

import { useAuthContext } from '../../hooks/auth/useAuthContext';
import { useCommentContext } from '../../hooks/comment/useCommentContext';
import { useCommentsContext } from '../../hooks/comments/useCommentsContext';

import CommentDropdown from '../CommentDropdown/CommentDropdown';
import InteractionButton from '../InteractionButton/InteractionButton';

import formatDate from '../../utils/formatDate';
import processText from '../../utils/processText';

function Comment({ tweet, tweetStats, comment, handlePagination }) {
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const { comments, pagination } = useCommentsContext();
  const { count } = useCommentContext();
  const { userInfo } = useAuthContext();

  const expandRef = useRef();

  const handleClick = (e) => {
    if (e.target.classList.contains('comment-dropdown')) return;
    setMenuIsOpen(!menuIsOpen);
  };

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
          <div className="comment-header">
            <div className="comment-info">
              <Link to={`/users/${comment.user.slug}/${comment.user._id}`}>
                {comment.user.name || userInfo.name}
              </Link>
              <span>{formatDate(comment.createdAt)}</span>
            </div>

            {(comment.user._id === userInfo._id || !comment.user._id) && (
              <ClickAwayListener onClickAway={() => setMenuIsOpen(false)}>
                <div className="comment-menu" onClick={(e) => handleClick(e)}>
                  <span className="material-symbols-outlined">more_horiz</span>
                  {menuIsOpen && (
                    <CommentDropdown tweet={tweet} comment={comment} />
                  )}
                </div>
              </ClickAwayListener>
            )}
          </div>

          <p>{processText(comment.text)}</p>

          {comment.image && (
            <div className="comment-image">
              <img src={comment.image && comment.image.url} />
            </div>
          )}
        </div>

        <div className="comment-controls">
          <div className="comment-controls-left">
            <InteractionButton
              resource={comment}
              resType={'comments'}
              btnType={'like'}
              targetOne={'likes'}
              targetTwo={'liked'}
              symbol={'favorite'}
            />

            {count.likeCount > 0 && (
              <div className="like-info">
                <span>·</span>
                <span>{count.likeCount} Likes</span>
              </div>
            )}
          </div>

          {tweetStats.commentCount !== comments.length &&
            pagination?.next?.page && (
              <span ref={expandRef} onClick={() => handlePagination()}>
                Expand more...
              </span>
            )}
        </div>
      </div>
    </div>
  );
}

export default Comment;
