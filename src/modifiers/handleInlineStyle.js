import changeCurrentInlineStyle from "./changeCurrentInlineStyle";
import { EditorState, Modifier } from "draft-js";
import { inlineMatchers } from "../constants";
import insertText from "./insertText";
import { getCurrentLine as getLine } from "../utils";

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

const handleInlineStyle = (
  whitelist,
  editorStateWithoutCharacter,
  character
) => {
  const editorState = insertText(editorStateWithoutCharacter, character);
  let selection = editorState.getSelection();
  let line = getLine(editorState);
  let newEditorState = handleChange(editorState, line, whitelist);
  let lastEditorState = editorState;

  // Recursively resolve markdown, e.g. _*text*_ should turn into both italic and bold
  while (newEditorState !== lastEditorState) {
    lastEditorState = newEditorState;
    line = getLine(newEditorState);
    newEditorState = handleChange(newEditorState, line, whitelist);
  }

  if (newEditorState !== editorState) {
    let newContentState = newEditorState.getCurrentContent();
    selection = newEditorState.getSelection();

    if (character === "\n") {
      newContentState = Modifier.splitBlock(newContentState, selection);
    } else {
      newContentState = Modifier.insertText(newContentState, selection, " ");
    }

    newEditorState = EditorState.push(
      newEditorState,
      newContentState,
      "change-inline-style"
    );

    return newEditorState;
  }

  return editorStateWithoutCharacter;
};

export default handleInlineStyle;
