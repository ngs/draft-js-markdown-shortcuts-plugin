import React from 'react';
import zeroWidthSpaces from './zeroWidthSpaces';

const replaceLeafContent = (leaf, replaceFn) => {
  const {
    text,
    ...props
  } = leaf.props;
  const replacedText = replaceFn(text);
  props.text = zeroWidthSpaces(text.length - replacedText.length) + replacedText;
  return React.createElement(leaf.type, props);
};

export default replaceLeafContent;
