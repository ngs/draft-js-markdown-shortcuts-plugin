const zeroWidthSpaces = (length) => {
  let spaces = '';
  while (spaces.length < length) {
    spaces += '\u200B';
  }
  return spaces;
};

export default zeroWidthSpaces;
