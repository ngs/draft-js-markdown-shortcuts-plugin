import { OrderedSet } from "immutable";
import { EditorState } from "draft-js";

export default editorState =>
  editorState.getCurrentInlineStyle().size === 0
    ? editorState
    : EditorState.setInlineStyleOverride(editorState, OrderedSet());
