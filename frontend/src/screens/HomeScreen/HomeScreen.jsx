import { useEffect } from 'react';

import { useGetTweets } from '../../hooks/tweets/useGetTweets';
import { useTweetsContext } from '../../hooks/tweets/useTweetsContext';
import { useAuthContext } from '../../hooks/auth/useAuthContext';

import TweetForm from '../../components/TweetForm/TweetForm';
import Tweet from '../../components/Tweet/Tweet';
import Trending from '../../components/Trending/Trending';
import Suggestions from '../../components/Suggestions/Suggestions';

// @todo: create tweet context & getTweets hook
// - context/tweets/tweetContext.jsx
// - context/tweets/tweetReducer.jsx
// - hooks/tweets/useTweetContext.jsx
// - hooks/tweets/useGetTweets.jsx

// @todo: map through tweets & display them

function HomeScreen() {
  const { getTweets } = useGetTweets();
  const { tweets } = useTweetsContext();
  const { userInfo } = useAuthContext();

  useEffect(() => {
    const fetchTweets = async () => await getTweets();
    fetchTweets();
  }, [userInfo]);

  console.log(tweets);

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
