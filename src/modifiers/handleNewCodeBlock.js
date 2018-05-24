import changeCurrentBlockType from "./changeCurrentBlockType";
import insertEmptyBlock from "./insertEmptyBlock";
import splitBlockAndChange from "./splitBlockAndChange";
import { CODE_BLOCK_REGEX } from "../constants";

const handleNewCodeBlock = editorState => {
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const key = selection.getStartKey();
  const currentBlock = contentState.getBlockForKey(key);
  const matchData = CODE_BLOCK_REGEX.exec(currentBlock.getText());
  const currentText = currentBlock.getText();
  const endOffset = selection.getEndOffset();
  // We .trim the text here to make sure pressing enter after "``` " works even if the cursor is before the space
  const isLast =
    endOffset === currentText.length || endOffset === currentText.trim().length;
  if (matchData && isLast) {
    const data = {};
    const language = matchData[1];
    if (language) {
      data.language = language;
    }
    const editorStateWithCodeBlock = changeCurrentBlockType(
      editorState,
      "code-block",
      "",
      data
    );
    return splitBlockAndChange(
      editorStateWithCodeBlock,
      undefined,
      undefined,
      false
    );
  }
  const type = currentBlock.getType();
  if (type === "code-block" && isLast) {
    return insertEmptyBlock(editorState, "code-block", currentBlock.getData());
  }
  return editorState;
};

export default handleNewCodeBlock;
