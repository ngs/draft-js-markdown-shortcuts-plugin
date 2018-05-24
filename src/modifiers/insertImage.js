import {
  EditorState,
  RichUtils,
  SelectionState,
  Modifier,
  AtomicBlockUtils,
} from "draft-js";

const insertImage = (editorState, matchArr, entityType) => {
  const currentContent = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const key = selection.getStartKey();
  const [matchText, alt, src, title] = matchArr;
  const { index } = matchArr;
  const focusOffset = index + matchText.length;
  const wordSelection = SelectionState.createEmpty(key).merge({
    anchorOffset: index,
    focusOffset,
  });
  const nextContent = currentContent.createEntity(entityType, "IMMUTABLE", {
    alt,
    src,
    title,
  });
  const entityKey = nextContent.getLastCreatedEntityKey();
  let newContentState = Modifier.replaceText(
    nextContent,
    wordSelection,
    "\u200B",
    null,
    entityKey
  );
  newContentState = Modifier.insertText(
    newContentState,
    newContentState.getSelectionAfter(),
    " "
  );
  const newWordSelection = wordSelection.merge({
    focusOffset: index + 1,
  });
  let newEditorState = EditorState.push(
    editorState,
    newContentState,
    "insert-image"
  );
  newEditorState = RichUtils.toggleLink(
    newEditorState,
    newWordSelection,
    entityKey
  );
  newEditorState = AtomicBlockUtils.insertAtomicBlock(
    newEditorState,
    newEditorState.getCurrentContent().getLastCreatedEntityKey(),
    " "
  );
  return EditorState.forceSelection(
    newEditorState,
    newEditorState.getCurrentContent().getSelectionAfter()
  );
};

export default insertImage;
