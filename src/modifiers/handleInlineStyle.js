import changeCurrentInlineStyle from "./changeCurrentInlineStyle";
import { EditorState, Modifier } from "draft-js";
import { inlineMatchers } from "../constants";

const handleChange = (editorState, line, whitelist) => {
  let newEditorState = editorState;
  Object.keys(inlineMatchers)
    .filter(matcher => whitelist.includes(matcher))
    .some(k => {
      inlineMatchers[k].some(re => {
        let matchArr;
        do {
          matchArr = re.exec(line);
          if (matchArr) {
            newEditorState = changeCurrentInlineStyle(
              newEditorState,
              matchArr,
              k
            );
          }
        } while (matchArr);
        return newEditorState !== editorState;
      });
      return newEditorState !== editorState;
    });
  return newEditorState;
};

const getLine = (editorState, anchorOffset) => {
  const selection = editorState.getSelection().merge({ anchorOffset });
  const key = editorState.getSelection().getStartKey();

  return editorState
    .getCurrentContent()
    .getBlockForKey(key)
    .getText()
    .slice(0, selection.getFocusOffset());
};

const handleInlineStyle = (whitelist, editorState, character) => {
  let selection = editorState.getSelection();
  let line = getLine(editorState, selection.getAnchorOffset());
  let newEditorState = handleChange(editorState, line, whitelist);
  let lastEditorState = editorState;

  while (newEditorState !== lastEditorState) {
    lastEditorState = newEditorState;
    line = getLine(newEditorState, selection.getAnchorOffset());
    newEditorState = handleChange(newEditorState, line, whitelist);
  }

  if (newEditorState !== editorState) {
    let newContentState = newEditorState.getCurrentContent();
    selection = newEditorState.getSelection();

    if (character === "\n") {
      newContentState = Modifier.splitBlock(newContentState, selection);
    } else {
      newContentState = Modifier.insertText(
        newContentState,
        selection,
        character
      );
    }

    newEditorState = EditorState.push(
      newEditorState,
      newContentState,
      "change-inline-style"
    );
  }

  return newEditorState;
};

export default handleInlineStyle;
