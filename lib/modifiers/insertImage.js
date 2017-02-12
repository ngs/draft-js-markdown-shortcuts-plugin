'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _draftJs = require('draft-js');

var insertImage = function insertImage(editorState, matchArr) {
  var currentContent = editorState.getCurrentContent();
  var selection = editorState.getSelection();
  var key = selection.getStartKey();

  var _matchArr = _slicedToArray(matchArr, 4),
      matchText = _matchArr[0],
      alt = _matchArr[1],
      src = _matchArr[2],
      title = _matchArr[3];

  var index = matchArr.index;

  var focusOffset = index + matchText.length;
  var wordSelection = _draftJs.SelectionState.createEmpty(key).merge({
    anchorOffset: index,
    focusOffset: focusOffset
  });
  var entityKey = _draftJs.Entity.create('IMG', 'IMMUTABLE', { alt: alt, src: src, title: title });
  var newContentState = _draftJs.Modifier.replaceText(currentContent, wordSelection, '\u200B', null, entityKey);
  newContentState = _draftJs.Modifier.insertText(newContentState, newContentState.getSelectionAfter(), ' ');
  var newWordSelection = wordSelection.merge({
    focusOffset: index + 1
  });
  var newEditorState = _draftJs.EditorState.push(editorState, newContentState, 'insert-image');
  newEditorState = _draftJs.RichUtils.toggleLink(newEditorState, newWordSelection, entityKey);
  return _draftJs.EditorState.forceSelection(newEditorState, newContentState.getSelectionAfter());
};

exports.default = insertImage;