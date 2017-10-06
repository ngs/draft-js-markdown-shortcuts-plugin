import { CheckableListItemUtils } from 'draft-js-checkable-list-item';
import { RichUtils } from 'draft-js';

const adjustBlockDepth = (editorState, ev, maxDepth = 4) => {
  const newEditorState = CheckableListItemUtils.onTab(ev, editorState, maxDepth);
  if (newEditorState !== editorState) {
    return newEditorState;
  }
  return RichUtils.onTab(ev, editorState, maxDepth);
};

export default adjustBlockDepth;
