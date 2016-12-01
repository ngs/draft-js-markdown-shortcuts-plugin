import { Modifier, EditorState, SelectionState } from 'draft-js';
import { uncheckedCheckbox, checkedCheckbox } from '../regexp';

const setChecked = (contentBlock, editorState, checked) => {
  const len = contentBlock.getLength();
  const textSelection = SelectionState.createEmpty(contentBlock.key).merge({
    focusOffset: len
  });
  let text = contentBlock.getText();
  if (checked) {
    text = text.replace(uncheckedCheckbox, '- [x] $1');
  } else {
    text = text.replace(checkedCheckbox, '- [ ] $1');
  }
  const replacedContent = Modifier.replaceText(
    editorState.getCurrentContent(),
    textSelection,
    text
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
