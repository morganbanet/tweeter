import { useDeleteTweet } from '../../hooks/tweets/useDeleteTweet';

function TweetDropdown(tweet) {
  const { deleteTweet, isLoading, error } = useDeleteTweet();

  return (
    <div className="tweet-dropdown">
      <div onClick={async () => await deleteTweet(tweet.tweet._id)}>
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

export default TweetDropdown;
