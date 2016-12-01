import { Modifier, EditorState, SelectionState } from 'draft-js';

const setChecked = (contentBlock, editorState, checked) => {
  const textSelection = SelectionState.createEmpty(contentBlock.key).merge({
    anchorOffset: 2
  });
  console.info(textSelection, contentBlock);

  const replacedContent = Modifier.replaceText(
    editorState.getCurrentContent(),
    textSelection,
    'test'
  );

  const changeType = `${checked ? 'check' : 'uncheck'}-md-checkbox`;

  const newEditorState = EditorState.push(
    editorState,
    replacedContent,
    changeType
  );
  return EditorState.forceSelection(newEditorState, replacedContent.getSelectionAfter());
};

export default setChecked;
