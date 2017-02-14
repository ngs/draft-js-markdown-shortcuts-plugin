/* eslint-disable no-underscore-dangle,no-plusplus */

import React from 'react';
import {
  blockRenderMap as checkboxBlockRenderMap, CheckableListItem, CheckableListItemUtils, CHECKABLE_LIST_ITEM
} from 'draft-js-checkable-list-item';

import { Map } from 'immutable';

import adjustBlockDepth from './modifiers/adjustBlockDepth';
import handleBlockType from './modifiers/handleBlockType';
import handleInlineStyle from './modifiers/handleInlineStyle';
import handleNewCodeBlock from './modifiers/handleNewCodeBlock';
import insertEmptyBlock from './modifiers/insertEmptyBlock';
import handleLink from './modifiers/handleLink';
import handleImage from './modifiers/handleImage';
import leaveList from './modifiers/leaveList';
import insertText from './modifiers/insertText';
import createLinkDecorator from './decorators/link';
import createImageDecorator from './decorators/image';
import { addText, addEmptyBlock } from './utils';

const INLINE_STYLE_CHARACTERS = [' ', '*', '_'];

function _handleCharacter(editorState, character) {
  if (INLINE_STYLE_CHARACTERS.indexOf(character) === -1) { return editorState; }
  let newEditorState = handleBlockType(editorState, character);
  if (editorState === newEditorState) {
    newEditorState = handleImage(editorState, character);
  }
  if (editorState === newEditorState) {
    newEditorState = handleLink(editorState, character);
  }
  if (editorState === newEditorState) {
    newEditorState = handleInlineStyle(editorState, character);
  }
  return newEditorState;
}

function _handleReturn(editorState, ev) {
  let newEditorState = editorState;
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const key = selection.getStartKey();
  const currentBlock = contentState.getBlockForKey(key);
  const type = currentBlock.getType();
  const text = currentBlock.getText();
  if (/-list-item$/.test(type) && text === '') {
    newEditorState = leaveList(editorState);
  }
  if (newEditorState === editorState &&
    (ev.ctrlKey || ev.shiftKey || ev.metaKey || ev.altKey || /^header-/.test(type))) {
    newEditorState = insertEmptyBlock(editorState);
  }
  if (newEditorState === editorState && type === 'code-block') {
    newEditorState = insertText(editorState, '\n');
  }
  if (newEditorState === editorState) {
    newEditorState = handleNewCodeBlock(editorState);
  }

  return newEditorState;
}

const createMarkdownShortcutsPlugin = (config = {}) => {
  const store = {};
  return {
    store,
    blockRenderMap: Map({
      'code-block': {
        element: 'code',
        wrapper: <pre spellCheck={'false'} />
      }
    }).merge(checkboxBlockRenderMap),
    decorators: [
      createLinkDecorator(config, store),
      createImageDecorator(config, store)
    ],
    initialize({ setEditorState, getEditorState }) {
      store.setEditorState = setEditorState;
      store.getEditorState = getEditorState;
    },
    blockStyleFn(block) {
      switch (block.getType()) {
        case CHECKABLE_LIST_ITEM:
          return CHECKABLE_LIST_ITEM;
        default:
          break;
      }
      return null;
    },

    blockRendererFn(block, { setEditorState, getEditorState }) {
      switch (block.getType()) {
        case CHECKABLE_LIST_ITEM: {
          return {
            component: CheckableListItem,
            props: {
              onChangeChecked: () => setEditorState(
                CheckableListItemUtils.toggleChecked(getEditorState(), block)
              ),
              checked: !!block.getData().get('checked'),
            },
          };
        }
        default:
          return null;
      }
    },
    onTab(ev, { getEditorState, setEditorState }) {
      const editorState = getEditorState();
      const newEditorState = adjustBlockDepth(editorState, ev);
      if (newEditorState !== editorState) {
        setEditorState(newEditorState);
        return 'handled';
      }
      return 'not-handled';
    },
    handleReturn(ev, { setEditorState, getEditorState }) {
      const editorState = getEditorState();
      const newEditorState = _handleReturn(editorState, ev);
      if (editorState !== newEditorState) {
        setEditorState(newEditorState);
        return 'handled';
      }
      return 'not-handled';
    },
    handleBeforeInput(character, { getEditorState, setEditorState }) {
      if (character !== ' ') {
        return 'not-handled';
      }
      const editorState = getEditorState();
      const newEditorState = _handleCharacter(editorState, character);
      if (editorState !== newEditorState) {
        setEditorState(newEditorState);
        return 'handled';
      }
      return 'not-handled';
    },
    handlePastedText(text, html, { getEditorState, setEditorState }) {
      const editorState = getEditorState();
      let newEditorState = editorState;
      const buffer = [];
      for (let i = 0; i < text.length; i++) {
        if (INLINE_STYLE_CHARACTERS.indexOf(text[i]) >= 0) {
          newEditorState = addText(newEditorState, buffer.join('') + text[i]);
          newEditorState = _handleCharacter(newEditorState, text[i]);
          buffer.length = 0;
        } else if (text[i].charCodeAt(0) === 10) {
          newEditorState = addText(newEditorState, buffer.join(''));
          newEditorState = addEmptyBlock(newEditorState);
          newEditorState = _handleReturn(newEditorState, {});
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

export default createMarkdownShortcutsPlugin;
