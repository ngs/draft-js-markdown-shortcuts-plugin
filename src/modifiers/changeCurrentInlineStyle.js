import { EditorState, SelectionState, Modifier } from "draft-js";

const changeCurrentInlineStyle = (editorState, matchArr, style, character) => {
  const currentContent = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const key = selection.getStartKey();
  const { index } = matchArr;
  const blockMap = currentContent.getBlockMap();
  const block = blockMap.get(key);
  const currentInlineStyle = block.getInlineStyleAt(index).merge();
  const newStyle = currentInlineStyle.merge([style]);
  const focusOffset = index + matchArr[0].length;

  const wordSelection = SelectionState.createEmpty(key).merge({
    anchorOffset: index,
    focusOffset,
  });

  const inlineStyles = [];
  const markdownCharacterLength = (matchArr[0].length - matchArr[1].length) / 2;

  let newContentState = currentContent;

  // if appendChar isn't defined add a space
  // if character is a newline - add empty string and later on - split block
  let appendChar = character == null ? " " : character;
  if (character == "\n") appendChar = "";

  // remove markdown delimiter at end
  newContentState = Modifier.replaceText(
    newContentState,
    wordSelection.merge({
      anchorOffset: wordSelection.getFocusOffset() - markdownCharacterLength,
    }),
    appendChar
  );

  let afterSelection = newContentState.getSelectionAfter();

  afterSelection = afterSelection.merge({
    anchorOffset: afterSelection.getFocusOffset() - markdownCharacterLength,
    focusOffset: afterSelection.getFocusOffset() - markdownCharacterLength,
  });

  // remove markdown delimiter at start
  newContentState = Modifier.replaceText(
    newContentState,
    wordSelection.merge({
      focusOffset: wordSelection.getAnchorOffset() + markdownCharacterLength,
    }),
    ""
  );

  // apply style
  newContentState = Modifier.applyInlineStyle(
    newContentState,
    wordSelection.merge({
      anchorOffset: index,
      focusOffset: focusOffset - markdownCharacterLength * 2,
    }),
    style
  );

  if (character == "\n") {
    newContentState = Modifier.splitBlock(newContentState, afterSelection);
    afterSelection = newContentState.getSelectionAfter();
  }

  const newEditorState = EditorState.push(
    editorState,
    newContentState,
    "change-inline-style"
  );

  return EditorState.forceSelection(newEditorState, afterSelection);
};

export default changeCurrentInlineStyle;
