import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { useGetTweets } from '../../hooks/tweets/useGetTweets';
import { useTweetsContext } from '../../hooks/tweets/useTweetsContext';

import { TweetProvider } from '../../context/tweet/TweetContext';
import { CommentsProvider } from '../../context/comments/CommentsContext';

import Tweet from '../../components/Tweet/Tweet';
import TweetForm from '../../components/TweetForm/TweetForm';
import Suggestions from '../../components/Suggestions/Suggestions';
import Trending from '../../components/Trending/Trending';

import Spinner from '../../components/Spinner/Spinner';

// @todo: build explore page
//        - plug in tweet component ✅
//        - filter component
//        - search box

function HomeScreen() {
  const [togglePage, setTogglePage] = useState(false);
  const [page, setPage] = useState(1);

  const { getTweets, isLoading, error } = useGetTweets();
  const { tweets, pagination } = useTweetsContext();

  useEffect(() => {
    getTweets(page);
  }, [page, togglePage]);

  const handlePagination = () => {
    setPage(pagination.next.page);
    setTogglePage(!togglePage);
  };

  return (
    <>
      <main>
        <section>
          <TweetForm />
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

      <section>
        <article>
          <Trending />
        </article>

        <article>
          <Suggestions />
        </article>
      </section>
    </>
  );
}

export default HomeScreen;
