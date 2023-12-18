import { useState, useEffect } from 'react';
import { useGetTweetLiked } from '../../hooks/likes/useGetTweetLiked';
import { useLikeTweet } from '../../hooks/likes/useLikeTweet';
import { useRemoveLike } from '../../hooks/likes/useRemoveLike';

function TweetLikeButton({ tweet, likeCount, setLikeCount }) {
  const [like, setLike] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  const { data: likedData } = useGetTweetLiked(tweet._id);
  const { likeTweet, data: likeData } = useLikeTweet();
  const { removeLike } = useRemoveLike();

  useEffect(() => {
    likedData && setLike(likedData);
    likeData && setLike(likeData);
    (likedData || likeData) && setIsLiked(true);
  }, [likedData, likeData]);
  useEffect(() => setLikeCount(tweet.likedCount), [tweet._id]);

  const handleLikeTweet = () => {
    if (isLiked) {
      removeLike(like._id);
      setLike(null);
      setIsLiked(false);
      setLikeCount(likeCount - 1);
    }

    if (!isLiked) {
      likeTweet(tweet._id);
      setLike(likeData);
      setIsLiked(true);
      setLikeCount(likeCount + 1);
    }
  };

  return (
    <div
      onClick={() => handleLikeTweet()}
      className={isLiked ? 'liked-tweet' : ''}
    >
      <span className={`material-symbols-outlined`}>favorite</span>
      {isLiked ? <p>Liked</p> : <p>Like</p>}
    </div>
  );
}

export default TweetLikeButton;
