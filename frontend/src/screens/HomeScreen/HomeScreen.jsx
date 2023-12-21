import { useGetTweets } from '../../hooks/tweets/useGetTweets';
import { useTweetsContext } from '../../hooks/tweets/useTweetsContext';

import { TweetProvider } from '../../context/tweet/TweetContext';
import { CommentsProvider } from '../../context/comments/CommentsContext';

import Tweet from '../../components/Tweet/Tweet';
import TweetForm from '../../components/TweetForm/TweetForm';
import Suggestions from '../../components/Suggestions/Suggestions';
import Trending from '../../components/Trending/Trending';

// @todo: add dropdown button on tweets and comment for deleting
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

        {tweets.map((tweet) => (
          <section key={tweet._id} className="tweets">
            <TweetProvider tweet={tweet}>
              <CommentsProvider>
                <Tweet tweet={tweet} />
              </CommentsProvider>
            </TweetProvider>
          </section>
        ))}
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
