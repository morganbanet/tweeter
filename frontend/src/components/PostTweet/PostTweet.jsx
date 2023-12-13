import { useAuthContext } from '../../hooks/auth/useAuthContext';

function PostTweet() {
  const { userInfo } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  const expandTextArea = (e, maxHeight) => {
    if (e.target.style.height === maxHeight + 'px') {
      e.target.style.overflow = 'visible';
    }

    e.target.style.height = '';
    e.target.style.height = Math.min(e.target.scrollHeight, maxHeight) + 'px';
  };

  // @todo: execute expandtextarea when changing to or from mobile(?)
  // @todo: add auth mock to test file
  // @todo: create dropdown for privacy
  // @todo: display image in component when uploading
  // @todo: create hook to post tweet

  return (
    <div className="post-tweet-container">
      <div>
        <h2>Tweet something</h2>
      </div>

      <form className="tweet-form" onSubmit={handleSubmit}>
        <div className="input-area">
          <div>
            <img src={userInfo.avatar.url} alt="profile avatar" />
          </div>

          <label htmlFor="body"></label>
          <textarea
            id="body"
            placeholder="What's happening?"
            onInput={(e) => expandTextArea(e, 200)}
          />
        </div>

        <div className="form-control">
          <div>
            <label htmlFor="file-upload">
              <span className="material-symbols-outlined">image</span>
            </label>
            <input type="file" id="file-upload"></input>

            <div className="privacy">
              <span className="material-symbols-outlined">public</span>
              <p>Everyone can reply</p>
            </div>
          </div>

          <button>Tweet</button>
        </div>
      </form>
    </div>
  );
}

export default PostTweet;
