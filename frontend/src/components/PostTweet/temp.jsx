import { useRef, useState } from 'react';
import { useAuthContext } from '../../hooks/auth/useAuthContext';
import { useCreateTweet } from '../../hooks/tweets/useCreateTweet';

// @todo: add auth mock to test file
// @todo: create dropdown for privacy

function PostTweet() {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);

  const imageRef = useRef();
  const cancelRef = useRef();

  const { userInfo } = useAuthContext();
  const { createTweet, isLoading, error } = useCreateTweet();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(file);

    await createTweet(text, file);

    if (text) {
      setText('');
      setFile(null);
      handleFile();
    }
  };

  const handleFile = (e) => {
    if (e && e.target.files[0]) {
      setFile(e.target.files[0]);
      displayFile(e);
      return;
    }

    if (!e) removeFile();
  };

  const expandTextarea = (e, maxHeight) => {
    setText(e.target.value);

    e.target.style.height === maxHeight + 'px'
      ? (e.target.style.overflow = 'visible')
      : (e.target.style.overflow = 'hidden');

    e.target.style.height = '';
    e.target.style.height = Math.min(e.target.scrollHeight, maxHeight) + 'px';
  };

  const displayFile = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();

      reader.onload = function (e) {
        imageRef.current.src = e.target.result;
        imageRef.current.style.display = 'block';
        cancelRef.current.style.display = 'inline';
      };

      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const removeFile = () => {
    console.log('test');
    imageRef.current.src = '#';
    imageRef.current.style.display = 'none';
    cancelRef.current.style.display = 'none';
  };

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

          <div className="preview">
            <label htmlFor="text"></label>
            <textarea
              id="text"
              value={text}
              placeholder="What's happening?"
              onChange={(e) => expandTextarea(e, 200)}
              required
            />

            <div className="image-container">
              <span
                ref={cancelRef}
                className="material-symbols-outlined cancel"
                onClick={() => removeFile()}
              >
                cancel
              </span>
              <img ref={imageRef} src="#" alt="selected file" />
            </div>
          </div>
        </div>

        <div className="form-control">
          <div>
            <label htmlFor="file-upload">
              <span className="material-symbols-outlined">image</span>
            </label>
            <input
              type="file"
              id="file-upload"
              onChange={(e) => handleFile(e)}
            />

            <div className="privacy">
              <span className="material-symbols-outlined">public</span>
              <p>Everyone can reply</p>
            </div>
          </div>

          {isLoading && <button disabled>Tweet</button>}
          {!isLoading && <button>Tweet</button>}
        </div>
      </form>
    </div>
  );
}

export default PostTweet;
