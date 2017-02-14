'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _draftJsCheckableListItem = require('draft-js-checkable-list-item');

var _immutable = require('immutable');

var _adjustBlockDepth = require('./modifiers/adjustBlockDepth');

var _adjustBlockDepth2 = _interopRequireDefault(_adjustBlockDepth);

var _handleBlockType = require('./modifiers/handleBlockType');

var _handleBlockType2 = _interopRequireDefault(_handleBlockType);

var _handleInlineStyle = require('./modifiers/handleInlineStyle');

var _handleInlineStyle2 = _interopRequireDefault(_handleInlineStyle);

var _handleNewCodeBlock = require('./modifiers/handleNewCodeBlock');

var _handleNewCodeBlock2 = _interopRequireDefault(_handleNewCodeBlock);

var _insertEmptyBlock = require('./modifiers/insertEmptyBlock');

var _insertEmptyBlock2 = _interopRequireDefault(_insertEmptyBlock);

var _handleLink = require('./modifiers/handleLink');

var _handleLink2 = _interopRequireDefault(_handleLink);

var _handleImage = require('./modifiers/handleImage');

var _handleImage2 = _interopRequireDefault(_handleImage);

var _leaveList = require('./modifiers/leaveList');

var _leaveList2 = _interopRequireDefault(_leaveList);

var _insertText = require('./modifiers/insertText');

var _insertText2 = _interopRequireDefault(_insertText);

var _link = require('./decorators/link');

var _link2 = _interopRequireDefault(_link);

var _image = require('./decorators/image');

var _image2 = _interopRequireDefault(_image);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var INLINE_STYLE_CHARACTERS = [' ', '*', '_']; /* eslint-disable no-underscore-dangle,no-plusplus */

function _handleCharacter(editorState, character) {
  if (INLINE_STYLE_CHARACTERS.indexOf(character) === -1) {
    return editorState;
  }
  var newEditorState = (0, _handleBlockType2.default)(editorState, character);
  if (editorState === newEditorState) {
    newEditorState = (0, _handleImage2.default)(editorState, character);
  }
  if (editorState === newEditorState) {
    newEditorState = (0, _handleLink2.default)(editorState, character);
  }
  if (editorState === newEditorState) {
    newEditorState = (0, _handleInlineStyle2.default)(editorState, character);
  }
  return newEditorState;
}

function _handleReturn(editorState, ev) {
  var newEditorState = editorState;
  var contentState = editorState.getCurrentContent();
  var selection = editorState.getSelection();
  var key = selection.getStartKey();
  var currentBlock = contentState.getBlockForKey(key);
  var type = currentBlock.getType();
  var text = currentBlock.getText();
  if (/-list-item$/.test(type) && text === '') {
    newEditorState = (0, _leaveList2.default)(editorState);
  }
  if (newEditorState === editorState && (ev.ctrlKey || ev.shiftKey || ev.metaKey || ev.altKey || /^header-/.test(type))) {
    newEditorState = (0, _insertEmptyBlock2.default)(editorState);
  }
  if (newEditorState === editorState && type === 'code-block') {
    newEditorState = (0, _insertText2.default)(editorState, '\n');
  }
  if (newEditorState === editorState) {
    newEditorState = (0, _handleNewCodeBlock2.default)(editorState);
  }

  return newEditorState;
}

var createMarkdownShortcutsPlugin = function createMarkdownShortcutsPlugin() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var store = {};
  return {
    store: store,
    blockRenderMap: (0, _immutable.Map)({
      'code-block': {
        element: 'code',
        wrapper: _react2.default.createElement('pre', { spellCheck: 'false' })
      }
    }).merge(_draftJsCheckableListItem.blockRenderMap),
    decorators: [(0, _link2.default)(config, store), (0, _image2.default)(config, store)],
    initialize: function initialize(_ref) {
      var setEditorState = _ref.setEditorState,
          getEditorState = _ref.getEditorState;

      store.setEditorState = setEditorState;
      store.getEditorState = getEditorState;
    },
    blockStyleFn: function blockStyleFn(block) {
      switch (block.getType()) {
        case _draftJsCheckableListItem.CHECKABLE_LIST_ITEM:
          return _draftJsCheckableListItem.CHECKABLE_LIST_ITEM;
        default:
          break;
      }
      return null;
    },
    blockRendererFn: function blockRendererFn(block, _ref2) {
      var setEditorState = _ref2.setEditorState,
          getEditorState = _ref2.getEditorState;

      switch (block.getType()) {
        case _draftJsCheckableListItem.CHECKABLE_LIST_ITEM:
          {
            return {
              component: _draftJsCheckableListItem.CheckableListItem,
              props: {
                onChangeChecked: function onChangeChecked() {
                  return setEditorState(_draftJsCheckableListItem.CheckableListItemUtils.toggleChecked(getEditorState(), block));
                },
                checked: !!block.getData().get('checked')
              }
            };
          }
        default:
          return null;
      }
    },
    onTab: function onTab(ev, _ref3) {
      var getEditorState = _ref3.getEditorState,
          setEditorState = _ref3.setEditorState;

      var editorState = getEditorState();
      var newEditorState = (0, _adjustBlockDepth2.default)(editorState, ev);
      if (newEditorState !== editorState) {
        setEditorState(newEditorState);
        return 'handled';
      }
      return 'not-handled';
    },
    handleReturn: function handleReturn(ev, _ref4) {
      var setEditorState = _ref4.setEditorState,
          getEditorState = _ref4.getEditorState;

      var editorState = getEditorState();
      var newEditorState = _handleReturn(editorState, ev);
      if (editorState !== newEditorState) {
        setEditorState(newEditorState);
        return 'handled';
      }
      return 'not-handled';
    },
    handleBeforeInput: function handleBeforeInput(character, _ref5) {
      var getEditorState = _ref5.getEditorState,
          setEditorState = _ref5.setEditorState;

      if (character !== ' ') {
        return 'not-handled';
      }
      var editorState = getEditorState();
      var newEditorState = _handleCharacter(editorState, character);
      if (editorState !== newEditorState) {
        setEditorState(newEditorState);
        return 'handled';
      }
      return 'not-handled';
    },
    handlePastedText: function handlePastedText(text, html, _ref6) {
      var getEditorState = _ref6.getEditorState,
          setEditorState = _ref6.setEditorState;

      var editorState = getEditorState();
      var newEditorState = editorState;
      var buffer = [];
      for (var i = 0; i < text.length; i++) {
        if (INLINE_STYLE_CHARACTERS.indexOf(text[i]) >= 0) {
          newEditorState = (0, _utils.addText)(newEditorState, buffer.join('') + text[i]);
          newEditorState = _handleCharacter(newEditorState, text[i]);
          buffer.length = 0;
        } else if (text[i].charCodeAt(0) === 10) {
          newEditorState = (0, _utils.addText)(newEditorState, buffer.join(''));
          newEditorState = (0, _utils.addEmptyBlock)(newEditorState);
          newEditorState = _handleReturn(newEditorState, {});
          buffer.length = 0;
        } else if (i === text.length - 1) {
          newEditorState = (0, _utils.addText)(newEditorState, buffer.join('') + text[i]);
          buffer.length = 0;
        } else {
          buffer.push(text[i]);
        }
      }

      if (editorState !== newEditorState) {
        setEditorState(newEditorState);
        return 'handled';
      }
      return 'not-handled';
    }
  };
};

exports.default = createMarkdownShortcutsPlugin;