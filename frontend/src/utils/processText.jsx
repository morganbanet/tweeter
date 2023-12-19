import React from 'react';
import { Link } from 'react-router-dom';

// prettier-ignore
const processText = (text) => {
  return text.split(/(\s+)/).map((word, index) => {
    const hashtag = <Link to={'/explore'} key={index} className="hashtag">{word}</Link>
    const text = <React.Fragment key={index}>{word}</React.Fragment>;
    return word.startsWith('#') ? hashtag : text
  });
};

export default processText;
