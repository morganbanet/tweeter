import { useAuthContext } from '../../hooks/auth/useAuthContext';

function Comment({ tweet }) {
  const { userInfo } = useAuthContext();

  return (
    <div className="tweet-comment">
      <div className="comment-avatar">
        <img src={userInfo.avatar.url} />
      </div>

      <div className="comment-area">
        <div className="comment-container">
          <div className="comment-info">
            <p>Waqar Bloom</p>
            <span>24 August at 20:43</span>
          </div>

          <p>
            I’ve seen awe-inspiring things that I thought I’d never be able to
            explain to another person.
          </p>
        </div>

        <div className="comment-controls">
          <div className="like-btn">
            <span className="material-symbols-outlined">favorite</span>
            <p>Like</p>
          </div>

          <div className="like-info">
            <span>·</span>
            <span>12k Likes</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Comment;
