import TweetForm from '../../components/TweetForm/TweetForm';
import Trending from '../../components/Trending/Trending';

function HomeScreen() {
  return (
    <>
      <main>
        <section>
          <TweetForm />
        </section>

        <article>
          <Trending />
        </article>
      </main>
    </>
  );
}

export default HomeScreen;
