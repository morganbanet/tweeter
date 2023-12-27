import { useAuthContext } from '../../hooks/auth/useAuthContext';
import { useGetSuggestions } from '../../hooks/suggestions/useGetSuggestions';
import { useSuggestionsContext } from '../../hooks/suggestions/useSuggestionsContext';
import SuggestionsItem from '../SuggestionsItem/SuggestionsItem';

function Suggestions() {
  const { userInfo } = useAuthContext();
  const { isLoading, error } = useGetSuggestions();
  const { suggestions } = useSuggestionsContext();

  return (
    <div className="suggestions-container">
      <h2>Who to follow</h2>

      <ul>
        {suggestions
          .filter((suggestion) => suggestion._id !== userInfo._id)
          .slice(0, 2)
          .map((suggestion) => (
            <SuggestionsItem key={suggestion._id} user={suggestion} />
          ))}
      </ul>
    </div>
  );
}

export default Suggestions;
