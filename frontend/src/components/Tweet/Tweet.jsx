import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import { useAuthContext } from '../../hooks/auth/useAuthContext';
import { useGetComments } from '../../hooks/comments/useGetComments';

import Comment from '../Comment/Comment';
import CommentForm from '../CommentForm/CommentForm';
import InteractionButton from '../InteractionButton/InteractionButton';

import formatDate from '../../utils/formatDate';
import processText from '../../utils/processText';

function Tweet({ tweet }) {
  const [commentCount, setCommentCount] = useState(0);
  const [retweetCount, setRetweetCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarkCount, setBookmarkCount] = useState(0);

  const [comments, setComments] = useState([]);
  const [formIsOpen, setFormIsOpen] = useState(false);

  const controlsRef = useRef();

  const retweet = tweet.retweeted ? tweet : null;
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
  useEffect(() => handleControlsBorder(), [formIsOpen, data]);

  const handleControlsBorder = () => {
    controlsRef.current.style.marginBottom =
      formIsOpen || commentCount > 0 ? '0.59rem' : '0';
    controlsRef.current.style.borderBottom =
      formIsOpen || commentCount > 0 ? '1px solid #f2f2f2' : 'none';
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
        <div className="user-info">
          <div className="tweet-avatar">
            <Link to={`/users/${tweet.user.slug}/${tweet.user._id}`}>
              <img
                src={tweet.user.avatar?.url || userInfo.avatar.url}
                alt="user avatar"
              />
            </Link>
          </div>

          <div className="tweet-user-date">
            <Link to={`/users/${tweet.user.slug}/${tweet.user._id}`}>
              {tweet.user.name}
            </Link>
            <span>{formatDate(tweet.createdAt)}</span>
          </div>
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
          {commentCount > 0 && <span>{commentCount} Comments</span>}
          {retweetCount > 0 && <span>{retweetCount} Retweets</span>}
          {likeCount > 0 && <span>{likeCount} Likes</span>}
          {bookmarkCount > 0 && <span>{bookmarkCount} Saved</span>}
        </div>

        <div ref={controlsRef} className="tweet-controls">
          <div onClick={() => setFormIsOpen(!formIsOpen)}>
            <span className="material-symbols-outlined">mode_comment</span>
            <p>Comment</p>
          </div>

          <InteractionButton
            resource={tweet}
            count={retweetCount}
            setCount={setRetweetCount}
            resType={'tweets'}
            btnType={'retweet'}
            targetOne={'retweets'}
            targetTwo={'retweeted'}
            symbol={'sync'}
          />

          <InteractionButton
            resource={tweet}
            count={likeCount}
            setCount={setLikeCount}
            resType={'tweets'}
            btnType={'like'}
            targetOne={'likes'}
            targetTwo={'liked'}
            symbol={'favorite'}
          />

          <InteractionButton
            resource={tweet}
            count={bookmarkCount}
            setCount={setBookmarkCount}
            resType={'tweets'}
            btnType={'bookmark'}
            targetOne={'bookmarks'}
            targetTwo={'bookmarked'}
            symbol={'bookmark'}
          />
        </div>

        {formIsOpen && (
          <CommentForm
            tweet={tweet}
            setComments={setComments}
            commentCount={commentCount}
            setCommentCount={setCommentCount}
            formIsOpen={formIsOpen}
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
