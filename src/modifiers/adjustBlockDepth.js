import { CheckableListItemUtils } from 'draft-js-checkable-list-item';
import { Modifier, EditorState } from 'draft-js';

const adjustBlockDepth = (editorState, ev) => {
  
  const tabDepth = 4;
    
  const newEditorState = CheckableListItemUtils.onTab(ev, editorState, tabDepth);
  if (newEditorState !== editorState) {
    return newEditorState;
  }
    
  let selectionState = editorState.getSelection();
  let anchorKey = selectionState.getAnchorKey();
  let currentContent = editorState.getCurrentContent();
  let currentContentBlock = currentContent.getBlockForKey(anchorKey);
  let start = selectionState.getStartOffset();
  let end = selectionState.getEndOffset();
  let selectedText = currentContentBlock.getText().slice(start, end);
    
  let nextState = Modifier.replaceText(currentContent, selectionState, (' ').repeat(tabDepth) + selectedText);
    
  return EditorState.push(editorState, nextState, 'indent');
};

export default adjustBlockDepth;
