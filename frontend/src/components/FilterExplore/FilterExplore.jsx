import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function FilterExplore({ handleFilters }) {
  const location = useLocation();

  const isActive = (paths) =>
    paths.every((path) => location.search.includes(path));

  useEffect(() => {
    handleFilters(location);
  }, [location]);

  return (
    <div className="filter-explore-container">
      <ul>
        <li>
          <div
            className={isActive(['tweets', 'top']) ? 'active-bar' : ''}
          ></div>
          <Link
            to="/explore?q=tweets&sort=top"
            className={isActive(['tweets', 'top']) ? 'active' : ''}
          >
            Top
          </Link>
        </li>

        <li>
          <div
            className={isActive(['tweets', 'latest']) ? 'active-bar' : ''}
          ></div>
          <Link
            to="/explore?q=tweets&sort=latest"
            className={isActive(['tweets', 'latest']) ? 'active' : ''}
          >
            Latest
          </Link>
        </li>

        <li>
          <div className={isActive(['users', 'top']) ? 'active-bar' : ''}></div>
          <Link
            to="/explore?q=users&sort=top"
            className={isActive(['users', 'top']) ? 'active' : ''}
          >
            People
          </Link>
        </li>

        <li>
          <div
            className={isActive(['tweets', 'media']) ? 'active-bar' : ''}
          ></div>
          <Link
            to="/explore?q=tweets&eq=media"
            className={isActive(['tweets', 'media']) ? 'active' : ''}
          >
            Media
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default FilterExplore;
