import { useRef, useState } from 'react';
import { useAuthContext } from '../../hooks/auth/useAuthContext';
import { useCreateTweet } from '../../hooks/tweets/useCreateTweet';

// @todo: add auth mock to test file
// @todo: create dropdown for privacy
// @todo: create tweet context

function PostTweet() {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [privacy, setPrivacy] = useState('public');

  const imageRef = useRef();
  const cancelRef = useRef();
  const uploadRef = useRef();
  const textRef = useRef();

  const { createTweet, isLoading, error } = useCreateTweet();
  const { userInfo } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createTweet(text, file);

    if (!error) {
      setText('');
      resetFile();
    }
  };

  const handleText = (e) => {
    setText(e.target.value);
    expandTextarea(e, 200);
  };

  const handleFile = (e) => {
    setFile(e.target.files[0]);
    readFile(e.target.files[0]);
  };

  // reset file input
  const resetFile = () => {
    setFile(null);
    displayFile();
    uploadRef.current.value = null;
  };

  // read file before preview
  const readFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => displayFile(e);
    reader.readAsDataURL(file);
  };

  // toggle file preview
  const displayFile = (file) => {
    imageRef.current.src = file ? file.target.result : '#';
    imageRef.current.style.display = file ? 'block' : 'none';
    cancelRef.current.style.display = file ? 'inline' : 'none';
  };

  const expandTextarea = (e, maxHeight) => {
    const textarea = e.target;

    textarea.style.height === maxHeight + 'px'
      ? (textarea.style.overflow = 'visible')
      : (textarea.style.overflow = 'hidden');

    textarea.style.height = '';
    textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px';
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
              ref={textRef}
              value={text}
              onChange={(e) => handleText(e)}
              placeholder="What's happening?"
            />

            <div className="image-container">
              <span
                ref={cancelRef}
                className="material-symbols-outlined cancel"
                onClick={() => resetFile()}
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
              ref={uploadRef}
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
