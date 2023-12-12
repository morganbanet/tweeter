import PostTweet from '../../components/PostTweet/PostTweet';
import Trending from '../../components/Trending/Trending';

function HomeScreen() {
  return (
    <>
      <main>
        <section>
          <PostTweet />
        </section>

        <article>
          <Trending />
        </article>
      </main>
    </>
  );
}

export default HomeScreen;
