import { EditorState } from "draft-js";

const changeCurrentBlockType = (
  editorState,
  type,
  text,
  blockMetadata = {}
) => {
  const currentContent = editorState.getCurrentContent();
  let selection = editorState.getSelection();
  const key = selection.getStartKey();
  const blockMap = currentContent.getBlockMap();
  const block = blockMap.get(key);
  const data = block.getData().merge(blockMetadata);
  const newBlock = block.merge({ type, data, text: text });

  const lastOffset = text.length;

  if (selection.getFocusOffset() > lastOffset) {
    selection = selection.merge({
      anchorOffset: lastOffset,
      focusOffset: lastOffset,
    });
  }

  const newContentState = currentContent.merge({
    blockMap: blockMap.set(key, newBlock),
    selectionAfter: selection,
  });

  return EditorState.push(editorState, newContentState, "change-block-type");
};

export default changeCurrentBlockType;
