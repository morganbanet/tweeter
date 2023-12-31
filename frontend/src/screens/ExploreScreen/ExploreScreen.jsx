import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { useFilterTweets } from '../../hooks/tweets/useFilterTweets';
import { useTweetsContext } from '../../hooks/tweets/useTweetsContext';

import { TweetProvider } from '../../context/tweet/TweetContext';
import { CommentsProvider } from '../../context/comments/CommentsContext';

import Tweet from '../../components/Tweet/Tweet';
import FilterExplore from '../../components/FilterExplore/FilterExplore';

import Spinner from '../../components/Spinner/Spinner';

function ExploreScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [togglePage, setTogglePage] = useState(false);

  const { filterTweets, isLoading: filtersLoading, error } = useFilterTweets();
  const { tweets, pagination } = useTweetsContext();

  useEffect(() => {
    if (filtersLoading === false) setIsLoading(false);
  }, [filtersLoading]);

  useEffect(() => {
    filters.type === 'tweets' && filterTweets(filters, page);
  }, [page, togglePage, filters]);

  const handlePagination = () => {
    setPage(pagination.next.page);
    setTogglePage(!togglePage);
  };

  const handleFilters = (query) => {
    setIsLoading(true);

    const searchParams = new URLSearchParams(query.search);

    const filters = {
      type: searchParams.get('q'),
      sort: searchParams.get('sort'),
      eq: searchParams.get('eq'),
    };

    setPage(1);
    setFilters(filters);
  };

  return (
    <>
      <section>
        <article>
          <FilterExplore handleFilters={handleFilters} />
        </article>
      </section>

      <main>
        <section>
          <h2>Search box</h2>
        </section>

        <section className="mobile-filters">
          <article>
            <FilterExplore handleFilters={handleFilters} />
          </article>
        </section>

        {isLoading && <Spinner />}
        {!isLoading && (
          <section className="tweets">
            <InfiniteScroll
              dataLength={tweets.length}
              next={handlePagination}
              hasMore={pagination?.next?.page ? true : false}
              loader={<Spinner />}
              endMessage={<p>You reached the end</p>}
            >
              {tweets.map((tweet) => (
                <React.Fragment key={tweet._id}>
                  <TweetProvider tweet={tweet}>
                    <CommentsProvider>
                      <Tweet tweet={tweet} />
                    </CommentsProvider>
                  </TweetProvider>
                </React.Fragment>
              ))}
            </InfiniteScroll>
          </section>
        )}
      </main>
    </>
  );
}

export default ExploreScreen;
