import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import { CommentProvider } from '../../context/comment/CommentContext';

import { useTweetContext } from '../../hooks/tweet/useTweetContext';
import { useCommentsContext } from '../../hooks/comments/useCommentsContext';
import { useAuthContext } from '../../hooks/auth/useAuthContext';
import { useGetComments } from '../../hooks/comments/useGetComments';

import Comment from '../Comment/Comment';
import CommentForm from '../CommentForm/CommentForm';
import InteractionButton from '../InteractionButton/InteractionButton';

import formatDate from '../../utils/formatDate';
import processText from '../../utils/processText';
import { handleControlsBorder } from '../../utils/handleBorder';

function Tweet({ tweet }) {
  const [isOpen, setIsOpen] = useState(false);

  const retweet = tweet.retweeted ? tweet : null;
  tweet = tweet.retweeted || tweet;

  const { count } = useTweetContext();
  const { userInfo } = useAuthContext();
  const { comments } = useCommentsContext();
  const { isLoading, error } = useGetComments(tweet._id);

  const controlsRef = useRef();

  useEffect(() => handleControlsBorder(controlsRef, isOpen, count), [isOpen]);

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
              {tweet.user.name || userInfo.name}
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
          {count.commentCount > 0 && <span>{count.commentCount} Comments</span>}
          {count.retweetCount > 0 && <span>{count.retweetCount} Retweets</span>}
          {count.likeCount > 0 && <span>{count.likeCount} Likes</span>}
          {count.bookmarkCount > 0 && <span>{count.bookmarkCount} Saved</span>}
        </div>

        <div ref={controlsRef} className="tweet-controls">
          <div onClick={() => setIsOpen(!isOpen)}>
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

        {isOpen && <CommentForm tweet={tweet} formIsOpen={isOpen} />}

        {comments.map((comment) => (
          <CommentProvider key={comment._id} comment={comment}>
            <Comment key={comment._id} tweet={tweet} comment={comment} />
          </CommentProvider>
        ))}
      </div>
    </div>
  );
}

export default Tweet;
