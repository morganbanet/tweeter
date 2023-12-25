import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';

import { useAuthContext } from '../../hooks/auth/useAuthContext';
import { useCommentContext } from '../../hooks/comment/useCommentContext';
import { useCommentsContext } from '../../hooks/comments/useCommentsContext';

import Modal from '../Modal/Modal';
import CommentDropdown from '../CommentDropdown/CommentDropdown';
import InteractionButton from '../InteractionButton/InteractionButton';

import formatDate from '../../utils/formatDate';
import processText from '../../utils/processText';
import { defaultAvatar } from '../../utils/defaults';

function Comment({ tweet, tweetStats, comment, handlePagination }) {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [targetOne, setType] = useState('');

  const { comments, pagination } = useCommentsContext();
  const { count } = useCommentContext();
  const { userInfo } = useAuthContext();

  const expandRef = useRef();

  useEffect(() => {
    modalIsOpen
      ? (document.body.style.overflow = 'hidden')
      : (document.body.style.overflow = 'visible');
  }, [modalIsOpen]);

  const handleClick = (e) => {
    if (e.target.classList.contains('comment-dropdown')) return;
    setMenuIsOpen(!menuIsOpen);
  };

  const handleModal = (e, targetOne) => {
    if (e.target.classList.contains('modal-container')) return;
    setType(targetOne);
    setModalIsOpen(!modalIsOpen);
  };

  return (
    <div className="tweet-comment">
      <div className="comment-avatar">
        <Link to={`/users/${comment.user.slug}/${comment.user._id}`}>
          <img
            src={comment.user.avatar?.url || defaultAvatar}
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
                <span onClick={(e) => handleModal(e, 'likes')}>
                  {count.likeCount} Likes
                </span>
              </div>
            )}

            {modalIsOpen && (
              <Modal
                setModalIsOpen={setModalIsOpen}
                id={comment._id}
                resType={'comments'}
                targetOne={targetOne}
              />
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
