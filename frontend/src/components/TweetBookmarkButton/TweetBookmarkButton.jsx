import { useState, useEffect } from 'react';
import { useGetBookmarked } from '../../hooks/bookmarks/useGetBookmarked';
import { useBookmarkTweet } from '../../hooks/bookmarks/useBookmarkTweet';
import { useRemoveBookmark } from '../../hooks/bookmarks/useRemoveBookmark';

function TweetBookmarkButton({ tweet, bookmarkCount, setBookmarkCount }) {
  const [bookmark, setBookmark] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const { data: bookmarkedData } = useGetBookmarked(tweet._id);
  const { bookmarkTweet, data: bookmarkData } = useBookmarkTweet(tweet._id);
  const { removeBookmark } = useRemoveBookmark();

  useEffect(() => {
    bookmarkedData && setBookmark(bookmarkedData);
    bookmarkData && setBookmark(bookmarkData);
    (bookmarkData || bookmarkedData) && setIsBookmarked(true);
  }, [bookmarkedData, bookmarkData]);
  useEffect(() => setBookmarkCount(tweet.bookmarkCount), [tweet._id]);

  const handleBookmarkTweet = () => {
    if (isBookmarked) {
      removeBookmark(bookmark._id);
      setBookmark(null);
      setIsBookmarked(false);
      setBookmarkCount(bookmarkCount - 1);
    }

    if (!isBookmarked) {
      bookmarkTweet(tweet._id);
      setBookmark(bookmarkData);
      setIsBookmarked(true);
      setBookmarkCount(bookmarkCount + 1);
    }
  };

  return (
    <div
      onClick={() => handleBookmarkTweet()}
      className={isBookmarked ? 'saved-tweet' : ''}
    >
      <span className={`material-symbols-outlined`}>bookmark</span>
      {isBookmarked ? <p>Saved</p> : <p>Save</p>}
    </div>
  );
}

export default TweetBookmarkButton;
