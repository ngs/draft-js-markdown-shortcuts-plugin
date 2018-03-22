import changeCurrentInlineStyle from "./changeCurrentInlineStyle";
import { inlineMatchers } from "../constants";

const handleInlineStyle = (editorState, character) => {
  const key = editorState.getSelection().getStartKey();
  const text = editorState
    .getCurrentContent()
    .getBlockForKey(key)
    .getText();

  const line = `${text}${character}`;
  let newEditorState = editorState;

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
      } while (matchArr);
      return newEditorState !== editorState;
    });
    return newEditorState !== editorState;
  });
  return newEditorState;
};

export default handleInlineStyle;
