import { useEffect, useState } from 'react';

import { useGetTweets } from '../../hooks/tweets/useGetTweets';
import { useTweetsContext } from '../../hooks/tweets/useTweetsContext';

import { TweetProvider } from '../../context/tweet/TweetContext';
import { CommentsProvider } from '../../context/comments/CommentsContext';

import Tweet from '../../components/Tweet/Tweet';
import TweetForm from '../../components/TweetForm/TweetForm';
import Suggestions from '../../components/Suggestions/Suggestions';
import Trending from '../../components/Trending/Trending';

// @todo: add pagination for scrolling tweets and expanding comments
//          - fix pagination
//          - add infinite scroll

// @todo: create modal for listing users who liked or saved a post

function HomeScreen() {
  const [page, setPage] = useState(1);
  const [prevPage, setPrevPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [toggleRefresh, setToggleRefresh] = useState(false);

  const { tweets } = useTweetsContext();
  const { getTweets, isLoading, error } = useGetTweets(page, limit);

  // --- @todo: refactor pagination ---
  // re-renders all tweets when deleting a tweet. does this by setting
  // the limit to the amount of tweets currently rendered and fetching
  // that amount from page 1. resets the page back to where the user
  // was at afterwards so the user can carry on from where they left off
  const handlePagination = (refresh) => {
    if (!refresh) {
      setPage(prevPage + 1);
      setPrevPage(prevPage + 1);
    } else {
      setLimit(10 * page);
      setPrevPage(page);
      setPage(1);
      setToggleRefresh(!toggleRefresh);
    }
  };

  useEffect(() => {
    const fetchTweets = async () => getTweets(page, limit);
    fetchTweets();
    setLimit(10);
    console.log(page);
  }, [page, toggleRefresh]);

  return (
    <>
      <main>
        <section>
          <TweetForm />
        </section>

        {tweets.map((tweet) => (
          <section key={tweet._id} className="tweets">
            <TweetProvider tweet={tweet}>
              <CommentsProvider>
                <Tweet tweet={tweet} handlePagination={handlePagination} />
              </CommentsProvider>
            </TweetProvider>
          </section>
        ))}

        <button onClick={() => handlePagination()}>MORE</button>
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
