import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { CommentProvider } from '../../context/comment/CommentContext';
import { useTweetContext } from '../../hooks/tweet/useTweetContext';
import { useCommentsContext } from '../../hooks/comments/useCommentsContext';
import { useAuthContext } from '../../hooks/auth/useAuthContext';
import { useGetComments } from '../../hooks/comments/useGetComments';
import Modal from '../Modal/Modal';
import Comment from '../Comment/Comment';
import CommentForm from '../CommentForm/CommentForm';
import TweetDropdown from '../TweetDropdown/TweetDropdown';
import InteractionButton from '../InteractionButton/InteractionButton';
import formatDate from '../../utils/formatDate';
import processText from '../../utils/processText';
import { handleControlsBorder } from '../../utils/handleBorder';
import { defaultAvatar } from '../../utils/defaults';

function Tweet({ tweet }) {
  const [togglePage, setTogglePage] = useState(false);
  const [commentsPage, setCommentsPage] = useState(1);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [formIsOpen, setFormIsOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [targetOne, setType] = useState('');

  const retweet = tweet.retweeted ? tweet : null;
  tweet = tweet.retweeted || tweet;

  const { getComments, isLoading, error } = useGetComments(tweet._id);
  const { comments, pagination } = useCommentsContext();
  const { userInfo } = useAuthContext();
  const { count } = useTweetContext();

  const controlsRef = useRef();

  useEffect(
    () => handleControlsBorder(controlsRef, formIsOpen, count),
    [formIsOpen]
  );

  useEffect(() => {
    const fetchComments = async () => await getComments(commentsPage);
    fetchComments();
  }, [commentsPage, togglePage]);

  useEffect(() => {
    modalIsOpen
      ? (document.body.style.overflow = 'hidden')
      : (document.body.style.overflow = 'visible');
  }, [modalIsOpen]);

  const handlePagination = () => {
    setCommentsPage(pagination.next.page);
    setTogglePage(!togglePage);
  };

  const handleDropdown = (e) => {
    if (e.target.classList.contains('tweet-dropdown')) return;
    setMenuIsOpen(!menuIsOpen);
  };

  const handleModal = (e, targetOne) => {
    if (e.target.classList.contains('modal-container')) return;
    setType(targetOne);
    setModalIsOpen(!modalIsOpen);
  };

  return (
    <div className="tweet-container">
      {retweet && (
        <div className="retweet-info">
          <span className="material-symbols-outlined">sync</span>
          <Link to={`/users/${retweet.user.slug}/${retweet.user._id}`}>
            {retweet.user.name} Retweeted
          </Link>
        </div>
      )}

      <div className="tweet-container-inner">
        <div className="tweet-header">
          <div className="user-info">
            <div className="tweet-avatar">
              <Link to={`/users/${tweet.user.slug}/${tweet.user._id}`}>
                <img
                  src={tweet.user.avatar?.url || defaultAvatar}
                  alt="user avatar"
                />
              </Link>
            </div>

            <div className="tweet-user-date">
              <Link to={`/users/${tweet.user.slug}/${tweet.user._id}`}>
                {tweet.user.name || userInfo.name}
              </Link>
              <span>{formatDate(tweet.createdAt)}</span>
            </div>
          </div>

          {(tweet.user._id === userInfo._id || !tweet.user._id) && (
            <ClickAwayListener onClickAway={() => setMenuIsOpen(false)}>
              <div className="tweet-menu" onClick={(e) => handleDropdown(e)}>
                <span className="material-symbols-outlined">more_horiz</span>
                {menuIsOpen && <TweetDropdown tweet={tweet} />}
              </div>
            </ClickAwayListener>
          )}
        </div>

        <div className="tweet-body">
          <p>{processText(tweet.text)}</p>

          {tweet.image && (
            <div className="tweet-image">
              <img src={tweet.image && tweet.image.url} />
            </div>
          )}
        </div>

        <div className="tweet-stats">
          {count.commentCount > 0 && (
            <span onClick={(e) => handleModal(e, 'comments')}>
              {count.commentCount} Comments
            </span>
          )}

          {count.retweetCount > 0 && (
            <span onClick={(e) => handleModal(e, 'retweets')}>
              {count.retweetCount} Retweets
            </span>
          )}

          {count.likeCount > 0 && (
            <span onClick={(e) => handleModal(e, 'likes')}>
              {count.likeCount} Likes
            </span>
          )}

          {count.bookmarkCount > 0 && (
            <span onClick={(e) => handleModal(e, 'bookmarks')}>
              {count.bookmarkCount} Saves
            </span>
          )}

          {modalIsOpen && (
            <Modal
              setModalIsOpen={setModalIsOpen}
              id={tweet._id}
              resType={'tweets'}
              targetOne={targetOne}
            />
          )}
        </div>

        <div ref={controlsRef} className="tweet-controls">
          <div onClick={() => setFormIsOpen(!formIsOpen)}>
            <span className="material-symbols-outlined">mode_comment</span>
            <p>Comment</p>
          </div>

          <InteractionButton
            resource={tweet}
            resType={'tweets'}
            btnType={'retweet'}
            targetOne={'retweets'}
            targetTwo={'retweeted'}
            symbol={'sync'}
          />

          <InteractionButton
            resource={tweet}
            resType={'tweets'}
            btnType={'like'}
            targetOne={'likes'}
            targetTwo={'liked'}
            symbol={'favorite'}
          />

          <InteractionButton
            resource={tweet}
            resType={'tweets'}
            btnType={'bookmark'}
            targetOne={'bookmarks'}
            targetTwo={'bookmarked'}
            symbol={'bookmark'}
          />
        </div>

        {formIsOpen && <CommentForm tweet={tweet} formIsOpen={formIsOpen} />}

        {comments.map((comment) => (
          <div className="comments" key={comment._id}>
            <CommentProvider comment={comment}>
              <Comment
                tweet={tweet}
                tweetStats={count}
                comment={comment}
                handlePagination={handlePagination}
              />
            </CommentProvider>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tweet;
