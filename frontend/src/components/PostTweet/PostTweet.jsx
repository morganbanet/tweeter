import { useAuthContext } from '../../hooks/auth/useAuthContext';

function PostTweet() {
  const { userInfo } = useAuthContext();

  return (
    <div className="post-tweet-container">
      <div>
        <h2>Tweet Something</h2>
      </div>

      <form className="tweet-form">
        <img src={userInfo.avatar.url} alt="profile avatar" />

        <label htmlFor="body"></label>
        <textarea id="body" placeholder="What's happening?" />
      </form>
    </div>
  );
}

export default PostTweet;
