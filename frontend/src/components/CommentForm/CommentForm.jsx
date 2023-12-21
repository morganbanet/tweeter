import { useState, useRef, useEffect } from 'react';
import { useAuthContext } from '../../hooks/auth/useAuthContext';
import { useTweetContext } from '../../hooks/tweet/useTweetContext';
import { useCreateComment } from '../../hooks/comments/useCreateComment';
import { selectFile, deselectFile } from '../../utils/processFiles';
import { handleFormsBorder } from '../../utils/handleBorder';

function CommentForm({ tweet, formIsOpen }) {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);

  const imageRef = useRef();
  const cancelRef = useRef();
  const uploadRef = useRef();
  const formRef = useRef();

  const { count } = useTweetContext();
  const { userInfo } = useAuthContext();

  const { createComment, isLoading, error } = useCreateComment();
  useEffect(() => handleFormsBorder(formRef, count), [formIsOpen, count]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createComment(text, file, tweet._id);
    !error && (setText(''), processFile());
  };

  const processFile = (e, action) => {
    const payload = { e, file, setFile, imageRef, cancelRef, uploadRef };
    action === 'select' ? selectFile(payload) : deselectFile(payload);
  };

  return (
    <div ref={formRef} className="comment-form">
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
            onClick={() => processFile()}
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
          onChange={(e) => processFile(e, 'select')}
        />
      </form>
    </div>
  );
}

export default CommentForm;
