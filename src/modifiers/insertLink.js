import { EditorState, RichUtils, SelectionState, Entity, Modifier } from 'draft-js';


const insertLink = (editorState, matchArr) => {
  const currentContent = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const key = selection.getStartKey();
  const [
    matchText,
    text,
    href,
    title
  ] = matchArr;
  const { index } = matchArr;
  const focusOffset = index + matchText.length;
  const wordSelection = SelectionState.createEmpty(key).merge({
    anchorOffset: index,
    focusOffset
  });
  const entityKey = Entity.create(
    'LINK',
    'MUTABLE',
    { href, title }
  );
  let newContentState = Modifier.replaceText(
    currentContent,
    wordSelection,
    text,
    null,
    entityKey
  );
  newContentState = Modifier.insertText(
    newContentState,
    newContentState.getSelectionAfter(),
    ' '
  );
  const newWordSelection = wordSelection.merge({
    focusOffset: index + text.length
  });
  let newEditorState = EditorState.push(editorState, newContentState, 'insert-link');
  newEditorState = RichUtils.toggleLink(newEditorState, newWordSelection, entityKey);
  return EditorState.forceSelection(newEditorState, newContentState.getSelectionAfter());
};

export default insertLink;
