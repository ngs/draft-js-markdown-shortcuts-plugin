import { CHECKABLE_LIST_ITEM } from 'draft-js-checkable-list-item';
import { RichUtils } from 'draft-js';
import changeCurrentBlockType from './changeCurrentBlockType';

const sharps = (len) => {
  let ret = '';
  while (ret.length < len) {
    ret += '#';
  }
  return ret;
};

const blockTypes = [
  null,
  'header-one',
  'header-two',
  'header-three',
  'header-four',
  'header-five',
  'header-six'
];

const handleBlockType = (editorState, character) => {
  const key = editorState.getSelection().getStartKey();
  const text = editorState.getCurrentContent().getBlockForKey(key).getText();
  const line = `${text}${character}`;
  const blockType = RichUtils.getCurrentBlockType(editorState);
  for (let i = 1; i <= 6; i += 1) {
    if (line === `${sharps(i)} `) {
      return changeCurrentBlockType(editorState, blockTypes[i]);
    }
  }
  if (/^[*-] $/.test(line)) {
    return changeCurrentBlockType(editorState, 'unordered-list-item');
  }
  if (/^[\d]\. $/.test(line)) {
    return changeCurrentBlockType(editorState, 'ordered-list-item');
  }
  if (/^> $/.test(line)) {
    return changeCurrentBlockType(editorState, 'blockquote');
  }
  if (blockType === 'unordered-list-item' && /^\[[x ]] $/.test(line)) {
    return changeCurrentBlockType(editorState, CHECKABLE_LIST_ITEM);
  }
  return editorState;
};

export default handleBlockType;
