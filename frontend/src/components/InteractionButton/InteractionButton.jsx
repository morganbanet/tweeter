import { useState, useEffect } from 'react';
import { useGetInteracted } from '../../hooks/interactions/useGetInteracted';
import { useCreateInteraction } from '../../hooks/interactions/useCreateInteraction';
import { useRemoveInteraction } from '../../hooks/interactions/useRemoveInteraction';

function TweetInteractionButton(props) {
  // prettier-ignore
  const { resource, count, setCount, resType, btnType, targetOne, targetTwo, symbol } = props;
  const id = resource._id;

  const [interaction, setInteraction] = useState(null);
  const [isInteracted, setIsInteracted] = useState(false);

  const { data: interactedData } = useGetInteracted(id, targetOne, targetTwo);
  const { createInteraction, data: interactionData } = useCreateInteraction();
  const { removeInteraction } = useRemoveInteraction();

  useEffect(() => {
    interactedData && setInteraction(interactedData);
    interactionData && setInteraction(interactionData);
    interactedData && setIsInteracted(true);
  }, [interactedData, interactionData]);
  useEffect(() => setCount(resource[`${btnType}Count`]), [id]);

  const handleInteraction = () => {
    if (isInteracted) {
      removeInteraction(interaction._id, targetOne);
      setInteraction(null);
      setIsInteracted(false);
      setCount(count - 1);
    }

    if (!isInteracted) {
      createInteraction(id, resType, targetOne);
      setInteraction(interactionData);
      setIsInteracted(true);
      setCount(count + 1);
    }
  };

  let btnInteractedText;
  let btnText = `${btnType.charAt(0).toUpperCase()}${btnType.slice(1)}`;
  if (btnText.charAt(btnText.length - 1) === 'e') {
    btnInteractedText = `${btnText.slice(0, -1)}ed`;
  } else {
    btnInteractedText = `${btnText}ed`;
  }

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
