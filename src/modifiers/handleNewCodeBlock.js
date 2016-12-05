import changeCurrentBlockType from './changeCurrentBlockType';

const handleNewCodeBlock = (editorState) => {
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const key = selection.getStartKey();
  const currentBlock = contentState.getBlockForKey(key);
  const matchData = /^```([\w-]+)?$/.exec(currentBlock.getText());
  if (matchData && selection.getEndOffset() === currentBlock.getLength()) {
    return changeCurrentBlockType(editorState, 'code-block', { languageName: matchData[1] });
  }
  return editorState;
};

export default handleNewCodeBlock;
