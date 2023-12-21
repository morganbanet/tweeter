import { useDeleteComment } from '../../hooks/comments/useDeleteComment';

function CommentDropdown(comment) {
  const { deleteComment, isLoading, error } = useDeleteComment();

  return (
    <div className="comment-dropdown">
      <div onClick={async () => await deleteComment(comment.comment._id)}>
        <div>
          <span className="material-symbols-outlined">delete</span>
        </div>
        <p>Delete</p>
      </div>

      <div>
        <div>
          <span className="material-symbols-outlined">edit</span>
        </div>
        <p>Edit</p>
      </div>
    </div>
  );
}

export default CommentDropdown;
