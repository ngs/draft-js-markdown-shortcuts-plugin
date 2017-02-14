'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addText = addText;
exports.addEmptyBlock = addEmptyBlock;

var _draftJs = require('draft-js');

var _immutable = require('immutable');

function getEmptyContentBlock() {
  return new _draftJs.ContentBlock({
    key: (0, _draftJs.genKey)(),
    text: '',
    characterList: (0, _immutable.List)()
  });
}

function addText(editorState, bufferText) {
  var contentState = _draftJs.Modifier.insertText(editorState.getCurrentContent(), editorState.getSelection(), bufferText);
  return _draftJs.EditorState.push(editorState, contentState, 'insert-characters');
}

function addEmptyBlock(editorState) {
  var contentState = editorState.getCurrentContent();
  var emptyBlock = getEmptyContentBlock();
  var blockMap = contentState.getBlockMap();
  var selectionState = editorState.getSelection();
  contentState = contentState.merge({
    blockMap: blockMap.set(emptyBlock.getKey(), emptyBlock),
    selectionAfter: selectionState.merge({
      anchorKey: emptyBlock.getKey(),
      focusKey: emptyBlock.getKey(),
      anchorOffset: 0,
      focusOffset: 0
    })
  });
  return _draftJs.EditorState.push(editorState, contentState, 'insert-characters');
}