import changeCurrentInlineStyle from './changeCurrentInlineStyle';

const inlineMatchers = {
  BOLD: [
    /\*\*([^(?:**)]+)\*\*/g,
    /__([^(?:__)]+)__/g
  ],
  ITALIC: [
    /\*([^*]+)\*/g,
    /_([^_]+)_/g
  ],
  CODE: [
    /`([^`]+)`/g
  ]
};

const handleInlineStyle = (editorState, character) => {
  const key = editorState.getSelection().getStartKey();
  const text = editorState.getCurrentContent().getBlockForKey(key).getText();
  const line = `${text}${character}`;
  let newEditorState = null;
  Object.keys(inlineMatchers).some((k) => {
    inlineMatchers[k].some((re) => {
      let matchArr;
      do {
        matchArr = re.exec(line);
        if (matchArr) {
          newEditorState = changeCurrentInlineStyle(editorState, matchArr, k);
          return true;
        }
      } while (matchArr);
      return false;
    });
    return !!newEditorState;
  });
  return newEditorState || editorState;
};

export default handleInlineStyle;
