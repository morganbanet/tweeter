import { useDeleteTweet } from '../../hooks/tweets/useDeleteTweet';

function TweetDropdown({ tweet, handlePagination }) {
  const { deleteTweet, isLoading, error } = useDeleteTweet();

  const handleDeleteTweet = async () => {
    await deleteTweet(tweet._id);
    handlePagination(true);
  };

  return (
    <div className="tweet-dropdown">
      <div onClick={() => handleDeleteTweet()}>
        <div>
          <span className="material-symbols-outlined">delete</span>
        </div>
        <p>Delete</p>
      </div>

      {/* <div>
        <div>
          <span className="material-symbols-outlined">edit</span>
        </div>
        <p>Edit</p>
      </div> */}
    </div>
  );
}

export default TweetDropdown;
