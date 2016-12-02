import React from 'react';
import zeroWidthSpaces from './zeroWidthSpaces';

const replaceLeafContent = (leaf, replaceFn) => {
  const {
    text,
    ...props
  } = leaf.props;
  const replacedText = replaceFn(text);
  const textIndex = text.indexOf(replacedText);

  props.text = zeroWidthSpaces(textIndex) + replacedText + zeroWidthSpaces(text.length - replacedText.length - textIndex);
  return React.createElement(leaf.type, props);
};

export default replaceLeafContent;
