'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _changeCurrentInlineStyle = require('./changeCurrentInlineStyle');

var _changeCurrentInlineStyle2 = _interopRequireDefault(_changeCurrentInlineStyle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var inlineMatchers = {
  BOLD: [/\*\*(\S[^(?:*)]+\S)\*\*/g, /__(\S[^(?:_)]+\S)__/g],
  ITALIC: [/\*([^\s*][^*]+[^\s*])\*/g, /_([^\s_][^_]+[^\s_])_/g],
  CODE: [/`([^`]+)`/g],
  STRIKETHROUGH: [/~~(\S[^(?:~~)]+\S)~~/g]
};

var handleInlineStyle = function handleInlineStyle(editorState, character) {
  var key = editorState.getSelection().getStartKey();
  var text = editorState.getCurrentContent().getBlockForKey(key).getText();
  var line = '' + text + character;
  var newEditorState = editorState;
  Object.keys(inlineMatchers).some(function (k) {
    inlineMatchers[k].some(function (re) {
      var matchArr = void 0;
      do {
        matchArr = re.exec(line);
        if (matchArr) {
          newEditorState = (0, _changeCurrentInlineStyle2.default)(newEditorState, matchArr, k);
        }
      } while (matchArr);
      return newEditorState !== editorState;
    });
    return newEditorState !== editorState;
  });
  return newEditorState;
};

exports.default = handleInlineStyle;