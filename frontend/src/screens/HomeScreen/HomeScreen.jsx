import TweetForm from '../../components/TweetForm/TweetForm';
import Trending from '../../components/Trending/Trending';
import Suggestions from '../../components/Suggestions/Suggestions';

function HomeScreen() {
  return (
    <>
      <main>
        <section>
          <TweetForm />
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
