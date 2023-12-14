import { useRef, useState } from 'react';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { useAuthContext } from '../../hooks/auth/useAuthContext';
import { useCreateTweet } from '../../hooks/tweets/useCreateTweet';
import TweetFormDropdown from '../TweetFormDropdown/TweetFormDropdown';

// @todo: add tests to tweet form and its dropdown
// @todo: bring test coverage over 80% for all
// @todo: map through tweets & display them
// @todo: create tweet context

function PostTweet() {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  const imageRef = useRef();
  const cancelRef = useRef();
  const uploadRef = useRef();
  const textRef = useRef();

  const { createTweet, isLoading, error } = useCreateTweet();
  const { userInfo } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createTweet(text, file, isPrivate);

    if (!error) {
      setText('');
      resetFile();
      setIsPrivate(false);
    }
  };

  const handleClick = (e) => {
    if (e.target.classList.contains('tweet-form-dropdown')) return;
    setIsOpen(!isOpen);
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
              name="text"
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
              <span className="material-symbols-outlined image">image</span>
            </label>
            <input
              type="file"
              id="file-upload"
              name="file-upload"
              ref={uploadRef}
              onChange={(e) => handleFile(e)}
            />

            <ClickAwayListener onClickAway={() => setIsOpen(false)}>
              <div className="privacy" onClick={(e) => handleClick(e)}>
                <span className="material-symbols-outlined public">public</span>
                <p>{!isPrivate ? 'Everyone can reply' : 'People you follow'}</p>
                {isOpen && <TweetFormDropdown setIsPrivate={setIsPrivate} />}
              </div>
            </ClickAwayListener>
          </div>

          {isLoading && <button disabled>Tweet</button>}
          {!isLoading && <button>Tweet</button>}
        </div>
      </form>
    </div>
  );
}

export default PostTweet;
