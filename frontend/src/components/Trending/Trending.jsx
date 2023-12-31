import { Link } from 'react-router-dom';
import { useGetTrending } from '../../hooks/hashtags/useGetTrending';
import { useHashtagsContext } from '../../hooks/hashtags/useHashtagsContext';

function Trending() {
  const { isLoading, error } = useGetTrending();
  const { hashtags } = useHashtagsContext();

  return (
    <div className="trending-container">
      <h2>Trends for you</h2>

      <ul>
        {hashtags &&
          hashtags.map((hashtag) => (
            <li key={hashtag._id}>
              <Link to={`/explore?top&hashtag=${hashtag.hashtag}`}>
                {hashtag.hashtag}
              </Link>
              <span>{hashtag.count} Tweets</span>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default Trending;
