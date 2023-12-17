import { useEffect } from 'react';

import { useGetTweets } from '../../hooks/tweets/useGetTweets';
import { useTweetsContext } from '../../hooks/tweets/useTweetsContext';
import { useAuthContext } from '../../hooks/auth/useAuthContext';

import TweetForm from '../../components/TweetForm/TweetForm';
import Tweet from '../../components/Tweet/Tweet';
import Trending from '../../components/Trending/Trending';
import Suggestions from '../../components/Suggestions/Suggestions';

// @todo: make comment form functional, add image preview.
// maybe create hook for the display image function from TweetForm?
// - hooks/comments/useCreateComment.js

function HomeScreen() {
  const { getTweets, isLoading, error } = useGetTweets();
  const { tweets } = useTweetsContext();
  const { userInfo } = useAuthContext();

  useEffect(() => {
    const fetchTweets = async () => await getTweets();
    fetchTweets();
  }, [userInfo]);

  // console.log(tweets);

  return (
    <>
      <main>
        <section>
          <TweetForm />
        </section>

        <section className="tweets">
          {tweets &&
            tweets.map((tweet) => <Tweet key={tweet._id} tweet={tweet} />)}
        </section>
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
