import { genKey, ContentBlock, Modifier, EditorState } from 'draft-js';
import { List } from 'immutable';

function getEmptyContentBlock() {
  return new ContentBlock({
    key: genKey(),
    text: '',
    characterList: List(),
  });
}

export function addText(editorState, bufferText) {
  const contentState = Modifier.insertText(editorState.getCurrentContent(), editorState.getSelection(), bufferText);
  return EditorState.push(editorState, contentState, 'insert-characters');
}

export function addEmptyBlock(editorState) {
  let contentState = editorState.getCurrentContent();
  const emptyBlock = getEmptyContentBlock();
  const blockMap = contentState.getBlockMap();
  const selectionState = editorState.getSelection();
  contentState = contentState.merge({
    blockMap: blockMap.set(emptyBlock.getKey(), emptyBlock),
    selectionAfter: selectionState.merge({
      anchorKey: emptyBlock.getKey(),
      focusKey: emptyBlock.getKey(),
      anchorOffset: 0,
      focusOffset: 0,
    }),
  });
  return EditorState.push(editorState, contentState, 'insert-characters');
}
