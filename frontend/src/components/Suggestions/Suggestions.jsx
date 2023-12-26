import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/auth/AuthContext';
import { useGetTrending } from '../../hooks/hashtags/useGetTrending';
import { defaultAvatar, defaultBanner } from '../../utils/defaults';
import { useAuthContext } from '../../hooks/auth/useAuthContext';

function Suggestions() {
  const userInfo = useAuthContext();
  const { data, isLoading, error } = useGetTrending();

  return (
    <div className="suggestions-container">
      <h2>Who to follow</h2>

      <ul>
        {data &&
          data.slice(0, 2).map((item, index) => (
            <li key={index}>
              <div className="suggestion-header">
                <div className="user-info">
                  <div className="user-avatar">
                    <Link to={`/users/${item?.user?.slug}/${item?.user?._id}`}>
                      <img
                        src={item?.avatar?.url || defaultAvatar}
                        alt="user avatar"
                      />
                    </Link>
                  </div>

                  <div className="user-details">
                    <h3>Mikeal Stanely</h3>
                    <span>230k followers</span>
                  </div>
                </div>

                {userInfo?._id !== user?._id && isFollowing ? (
                  <button onClick={() => handleFollow()}>Follow</button>
                ) : (
                  <button onClick={() => handleFollow()}>
                    <span className="material-symbols-outlined">
                      person_add
                    </span>{' '}
                    Follow
                  </button>
                )}
              </div>

              <div className="user-bio">
                <p>
                  Photographer & Filmmaker based in Copenhagen, Denmark ✵ 🇩🇰
                </p>
              </div>

              <div className="user-banner">
                <img
                  src={item?.banner?.url || defaultBanner}
                  alt="user banner"
                />
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default Suggestions;
