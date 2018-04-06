import { EditorState, SelectionState, Modifier } from "draft-js";

const changeCurrentInlineStyle = (editorState, matchArr, style) => {
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

  // remove markdown delimiter at end
  newContentState = Modifier.removeRange(
    newContentState,
    wordSelection.merge({
      anchorOffset: wordSelection.getFocusOffset() - markdownCharacterLength,
    })
  );

  let afterSelection = newContentState.getSelectionAfter();

  afterSelection = afterSelection.merge({
    anchorOffset: afterSelection.getFocusOffset() - markdownCharacterLength,
    focusOffset: afterSelection.getFocusOffset() - markdownCharacterLength,
  });

  // remove markdown delimiter at start
  newContentState = Modifier.removeRange(
    newContentState,
    wordSelection.merge({
      focusOffset: wordSelection.getAnchorOffset() + markdownCharacterLength,
    })
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

  const newEditorState = EditorState.push(
    editorState,
    newContentState,
    "change-inline-style"
  );

  return EditorState.forceSelection(newEditorState, afterSelection);
};

export default changeCurrentInlineStyle;
