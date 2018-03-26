import changeCurrentInlineStyle from "./changeCurrentInlineStyle";
import { inlineMatchers } from "../constants";

const handleInlineStyle = (editorState, character) => {
  const selection = editorState.getSelection();
  const key = editorState.getSelection().getStartKey();
  const text = editorState
    .getCurrentContent()
    .getBlockForKey(key)
    .getText()
    .slice(0, selection.getFocusOffset());

  const line = `${text}`;
  let newEditorState = editorState;

  var i = 0;

  Object.keys(inlineMatchers).some(k => {
    inlineMatchers[k].some(re => {
      let matchArr;
      do {
        matchArr = re.exec(line);
        if (matchArr) {
          newEditorState = changeCurrentInlineStyle(
            newEditorState,
            matchArr,
            k,
            character
          );
        }
        i++;
      } while (matchArr);
      return newEditorState !== editorState;
    });
    return newEditorState !== editorState;
  });
  return newEditorState;
};

export default handleInlineStyle;
