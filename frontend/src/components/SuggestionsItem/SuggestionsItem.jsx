import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { defaultAvatar, defaultBanner } from '../../utils/defaults';
import { useAuthContext } from '../../hooks/auth/useAuthContext';
import { useGetFollows } from '../../hooks/follows/useGetFollows';
import { useFollowUser } from '../../hooks/follows/useFollowUser';
import { useUnfollowUser } from '../../hooks/follows/useUnfollowUser';
import Spinner from '../Spinner/Spinner';

function SuggestionsItem({ user }) {
  const [follow, setFollow] = useState(null);
  const [followerCount, setFollowerCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  const { userInfo } = useAuthContext();

  const { data, isLoading: followsLoading, error } = useGetFollows(user._id);
  const { unfollowUser, isLoading: unfollowLoading } = useUnfollowUser();

  const {
    followUser,
    data: followData,
    isLoading: followLoading,
  } = useFollowUser();

  useEffect(() => {
    setFollowerCount(user.followerCount);
    const item = data.find((item) => item.user._id === userInfo._id);
    item && setFollow(item);
    item && setIsFollowing(true);
  }, [data]);
  useEffect(() => setFollow(followData), [followData]);

  const handleFollow = () => {
    if (isFollowing) {
      setIsFollowing(false);
      setFollowerCount(followerCount - 1);
      unfollowUser(follow._id);
      setFollow(null);
    }

    if (!isFollowing) {
      setIsFollowing(true);
      setFollowerCount(followerCount + 1);
      followUser(user._id);
      setFollow(followData);
    }
  };

  return (
    <>
      <li>
        <div className="suggestion-header">
          <div className="user-info">
            <div className="user-avatar">
              <Link to={`/users/${user.slug}/${user._id}`}>
                <img
                  src={user.avatar?.url || defaultAvatar}
                  alt="user avatar"
                />
              </Link>
            </div>

            <div className="user-details">
              <Link to={`/users/${user.slug}/${user._id}`}>{user.name}</Link>
              <span>{followerCount} followers</span>
            </div>
          </div>

          {followsLoading && (
            <div className="spinner-container">
              <Spinner className="spinner" />
            </div>
          )}
          {!followsLoading && (
            <>
              {userInfo._id !== user._id && isFollowing && (
                <button
                  disabled={followLoading || unfollowLoading}
                  onClick={() => handleFollow()}
                >
                  Unfollow
                </button>
              )}

              {userInfo._id !== user._id && !isFollowing && (
                <button
                  disabled={followLoading || unfollowLoading}
                  onClick={() => handleFollow()}
                >
                  <span className="material-symbols-outlined">person_add</span>{' '}
                  Follow
                </button>
              )}
            </>
          )}
        </div>

        <div className="user-bio">
          <p>{user.bio}</p>
        </div>

        <div className="user-banner">
          <img src={user.banner?.url || defaultBanner} alt="user banner" />
        </div>
      </li>
    </>
  );
}

export default SuggestionsItem;
