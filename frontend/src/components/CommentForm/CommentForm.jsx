import { useAuthContext } from '../../hooks/auth/useAuthContext';

function CommentForm() {
  const { userInfo } = useAuthContext();

  return (
    <div className="comment-form">
      <div>
        <img src={userInfo.avatar.url} alt="user avatar" />
      </div>

      <form>
        <label htmlFor="comment" name="comment"></label>
        <input type="text" id="comment" placeholder="Tweet your reply" />

        <label htmlFor="file-upload" className="custom-upload">
          <span className="material-symbols-outlined">image</span>
        </label>
        <input type="file" id="file-upload" name="file-upload" />
      </form>
    </div>
  );
}

export default CommentForm;
