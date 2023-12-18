import { useState, useRef, useEffect } from 'react';
import { useAuthContext } from '../../hooks/auth/useAuthContext';
import { useCreateComment } from '../../hooks/comments/useCreateComment';

function CommentForm({ tweet, handleCreateComment }) {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);

  const imageRef = useRef();
  const cancelRef = useRef();
  const uploadRef = useRef();

  const { createComment, data, isLoading, error } = useCreateComment();
  const { userInfo } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createComment(text, file, tweet._id);

    if (!error) {
      setText('');
      resetFile();
    }
  };

  useEffect(() => {
    if (data) handleCreateComment(data);
  }, [data]);

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

  return (
    <div className="comment-form">
      <div>
        <img src={userInfo.avatar.url} alt="user avatar" />
      </div>

      <form onSubmit={handleSubmit}>
        <label htmlFor="comment" name="comment"></label>
        <input
          type="text"
          id="comment"
          placeholder="Tweet your reply"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="image-container">
          <span
            id={`cancel-${tweet._id}`}
            className="material-symbols-outlined cancel"
            ref={cancelRef}
            onClick={() => resetFile()}
          >
            cancel
          </span>
          <img ref={imageRef} id={`image`} src="#" alt="selected file" />
        </div>

        <label
          htmlFor={`upload-${tweet._id}`}
          className="custom-upload-comment"
        >
          <span className="material-symbols-outlined">image</span>
        </label>
        <input
          type="file"
          id={`upload-${tweet._id}`}
          name={`upload-${tweet._id}`}
          ref={uploadRef}
          onChange={(e) => handleFile(e)}
        />
      </form>
    </div>
  );
}

export default CommentForm;
