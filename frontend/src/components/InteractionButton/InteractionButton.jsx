import { useState, useEffect } from 'react';
import { useGetInteracted } from '../../hooks/interactions/useGetInteracted';
import { useCreateInteraction } from '../../hooks/interactions/useCreateInteraction';
import { useRemoveInteraction } from '../../hooks/interactions/useRemoveInteraction';

function TweetInteractionButton(props) {
  // prettier-ignore
  const { resource, resType, btnType, targetOne, targetTwo, symbol } = props;
  const id = resource._id;

  const [interaction, setInteraction] = useState(null);
  const [isInteracted, setIsInteracted] = useState(false);

  const { data: interactedData } = useGetInteracted(id, targetOne, targetTwo);
  const { createInteraction, data: interactionData } =
    useCreateInteraction(resType);
  const { removeInteraction } = useRemoveInteraction(resType);

  useEffect(() => {
    interactedData && setInteraction(interactedData);
    interactionData && setInteraction(interactionData);
    interactedData && setIsInteracted(true);
  }, [interactedData, interactionData]);

  const handleInteraction = () => {
    if (isInteracted) {
      removeInteraction(interaction._id, targetOne, btnType);
      setIsInteracted(false);
      setInteraction(null);
    }

    if (!isInteracted) {
      createInteraction(id, resType, targetOne, btnType);
      setIsInteracted(true);
      setInteraction(interactionData);
    }
  };

  let btnText = `${btnType.charAt(0).toUpperCase()}${btnType.slice(1)}`;

  let btnInteractedText;
  if (btnType === 'retweet') btnInteractedText = 'Retweeted';
  if (btnType === 'like') btnInteractedText = 'Liked';
  if (btnType === 'bookmark') btnInteractedText = 'Saved';

  const sync = symbol === 'sync' ? true : false;

  return (
    <div
      onClick={() => handleInteraction()}
      className={isInteracted ? targetTwo : 'uninteracted'}
    >
      <span className={`material-symbols-outlined ${sync ? 'sync' : ''}`}>
        {symbol}
      </span>

      {isInteracted ? <p>{btnInteractedText}</p> : <p>{btnText}</p>}
    </div>
  );
}

export default TweetInteractionButton;
