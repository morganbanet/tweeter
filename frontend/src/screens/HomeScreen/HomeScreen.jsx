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
//          - patch tweet pagination
//          - add infinite scroll to scrolling tweets

// @todo: create modal for listing users who liked or saved a post/cmnt

function HomeScreen() {
  const [togglePage, setTogglePage] = useState(false);
  const [page, setPage] = useState(1);

  const { getTweets, isLoading, error } = useGetTweets();
  const { tweets, pagination, dispatch } = useTweetsContext();

  useEffect(() => {
    const fetchTweets = async () => getTweets(page);
    fetchTweets();
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

        {tweets.map((tweet) => (
          <section key={tweet._id} className="tweets">
            <TweetProvider tweet={tweet}>
              <CommentsProvider>
                <Tweet tweet={tweet} />
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
