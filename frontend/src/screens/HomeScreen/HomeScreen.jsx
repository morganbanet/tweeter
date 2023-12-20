import { useGetTweets } from '../../hooks/tweets/useGetTweets';
import { useTweetsContext } from '../../hooks/tweets/useTweetsContext';

import Tweet from '../../components/Tweet/Tweet';
import TweetForm from '../../components/TweetForm/TweetForm';
import Suggestions from '../../components/Suggestions/Suggestions';
import Trending from '../../components/Trending/Trending';

// @todo: ensure only one comment form appears at any one time
// @todo: if comments or comment form open, show tweet controls border
// @todo: create modal for listing users who liked or saved a post

function HomeScreen() {
  const { isLoading, error } = useGetTweets();
  const { tweets } = useTweetsContext();

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
