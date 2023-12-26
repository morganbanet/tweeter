import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../hooks/auth/useAuthContext';
import { useGetFollows } from '../../hooks/follows/useGetFollows';
import { useFollowUser } from '../../hooks/follows/useFollowUser';
import { useUnfollowUser } from '../../hooks/follows/useUnfollowUser';

function ModalItem({ user }) {
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

  const handleFollow = async () => {
    if (isFollowing) {
      await unfollowUser(follow._id);
      setFollow(null);
      setIsFollowing(false);
      setFollowerCount(followerCount - 1);
    }

    if (!isFollowing) {
      setFollowerCount(followerCount + 1);
      await followUser(user._id);
      setFollow(followData);
      setIsFollowing(true);
    }
  };

  return (
    <>
      {!followsLoading && (
        <div className="item" key={user._id}>
          <div className="item-header">
            <div className="user-details">
              <Link to={`/users/${user.slug}/${user._id}`}>
                <div className="avatar">
                  <img
                    src={user.avatar?.url || defaultAvatar}
                    alt="user avatar"
                  />
                </div>
              </Link>

              <div className="username-followers">
                <Link to={`/users/${user.slug}/${user._id}`}>{user.name}</Link>
                <p>{followerCount} followers</p>
              </div>
            </div>

            {userInfo._id !== user._id && isFollowing ? (
              <button
                disabled={followLoading || unfollowLoading}
                onClick={() => handleFollow()}
              >
                Follow
              </button>
            ) : (
              <button
                disabled={followLoading || unfollowLoading}
                onClick={() => handleFollow()}
              >
                <span className="material-symbols-outlined">person_add</span>{' '}
                Follow
              </button>
            )}
          </div>

          <div className="bio">
            <p>{user.bio}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default ModalItem;
