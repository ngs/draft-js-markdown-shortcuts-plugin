import { EditorState, RichUtils, SelectionState, Entity, Modifier } from 'draft-js';


const insertLink = (editorState, matchArr) => {
  const currentContent = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const key = selection.getStartKey();
  const [
    matchText,
    alt,
    src,
    title
  ] = matchArr;
  const { index } = matchArr;
  const focusOffset = index + matchText.length;
  const wordSelection = SelectionState.createEmpty(key).merge({
    anchorOffset: index,
    focusOffset
  });
  const entityKey = Entity.create(
    'IMG',
    'IMMUTABLE',
    { alt, src, title }
  );
  let newContentState = Modifier.replaceText(
    currentContent,
    wordSelection,
    '\u200B',
    null,
    entityKey
  );
  newContentState = Modifier.insertText(
    newContentState,
    newContentState.getSelectionAfter(),
    ' '
  );
  const newWordSelection = wordSelection.merge({
    focusOffset: index + 1
  });
  let newEditorState = EditorState.push(editorState, newContentState, 'insert-image');
  newEditorState = RichUtils.toggleLink(newEditorState, newWordSelection, entityKey);
  return EditorState.forceSelection(newEditorState, newContentState.getSelectionAfter());
};

export default insertLink;
