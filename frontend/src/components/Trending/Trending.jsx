import { Link } from 'react-router-dom';
import { useGetTrending } from '../../hooks/hashtags/useGetTrending';

function Trending() {
  const { data, isLoading, error } = useGetTrending();

  return (
    <div className="trending-container">
      <h2>Trends for you</h2>

      <ul>
        {data &&
          data.map((item) => (
            <li key={item._id}>
              <Link to="/explore">{item.hashtag}</Link>
              <span>{item.count} Tweets</span>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default Trending;
