import { EditorState, SelectionState, Modifier } from "draft-js";

const STYLES = ["BOLD", "ITALIC", "CODE", "STRIKETHROUGH"];

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

  STYLES.forEach(_style =>
    block.findStyleRanges(
      styles => styles.getStyle().includes(_style),
      (start, end) => {
        if (focusOffset > start && index <= end) {
          inlineStyles.push({
            style: _style,
            start: start >= index ? start : index,
            end: end > focusOffset ? end : focusOffset,
          });
        }
      }
    )
  );

  console.log("yo inline styles", inlineStyles);

  let newContentState = Modifier.replaceText(
    currentContent,
    wordSelection,
    matchArr[1],
    newStyle
  );

  const afterSelection = newContentState.getSelectionAfter();

  // re-apply previous styles
  newContentState = inlineStyles.reduce(
    (content, { style: _style, start, end }) =>
      Modifier.applyInlineStyle(
        content,
        wordSelection.merge({ anchorOffset: start, focusOffset: end }),
        _style
      ),
    newContentState
  );

  newContentState = Modifier.insertText(
    newContentState,
    afterSelection,
    character || " "
  );

  const newEditorState = EditorState.push(
    editorState,
    newContentState,
    "change-inline-style"
  );

  return EditorState.forceSelection(
    newEditorState,
    newContentState.getSelectionAfter()
  );
};

export default changeCurrentInlineStyle;
