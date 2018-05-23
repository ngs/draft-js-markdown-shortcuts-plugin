import { EditorState, Modifier } from "draft-js";

const splitBlockAndChange = (
  editorState,
  type = "unstyled",
  blockMetadata = {},
  selectNewBlock = true
) => {
  let currentContent = editorState.getCurrentContent();
  const currentSelection = editorState.getSelection();
  currentContent = Modifier.splitBlock(currentContent, currentSelection);
  const selection = currentContent.getSelectionAfter();
  const key = selection.getStartKey();
  const blockMap = currentContent.getBlockMap();
  const block = blockMap.get(key);
  const data = block.getData().merge(blockMetadata);
  const newBlock = block.merge({ type, data });
  const newContentState = currentContent.merge({
    blockMap: blockMap.set(key, newBlock),
    selectionAfter: selectNewBlock ? selection : currentSelection,
  });

  return EditorState.push(editorState, newContentState, "split-block");
};

export default splitBlockAndChange;
