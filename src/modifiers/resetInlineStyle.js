import { OrderedSet } from "immutable";
import { EditorState } from "draft-js";

export default editorState =>
  EditorState.setInlineStyleOverride(editorState, OrderedSet());
