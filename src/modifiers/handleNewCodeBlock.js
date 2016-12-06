import changeCurrentBlockType from './changeCurrentBlockType';
import insertEmptyBlock from './insertEmptyBlock';

const handleNewCodeBlock = (editorState) => {
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const key = selection.getStartKey();
  const currentBlock = contentState.getBlockForKey(key);
  const matchData = /^```([\w-]+)?$/.exec(currentBlock.getText());
  if (matchData && selection.getEndOffset() === currentBlock.getLength()) {
    const language = matchData[1];
    return changeCurrentBlockType(editorState, 'code-block', '', { language });
  }
  const type = currentBlock.getType();
  if (type === 'code-block') {
    return insertEmptyBlock(editorState, 'code-block', currentBlock.getData());
  }
  return editorState;
};

export default handleNewCodeBlock;
