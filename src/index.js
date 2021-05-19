import React from 'react';
import {
  blockRenderMap as checkboxBlockRenderMap,
  CheckableListItem,
  CheckableListItemUtils,
  CHECKABLE_LIST_ITEM,
} from 'draft-js-checkable-list-item';

import {Map} from 'immutable';

import adjustBlockDepth from './modifiers/adjustBlockDepth';
import handleBlockType from './modifiers/handleBlockType';
import handleInlineStyle from './modifiers/handleInlineStyle';
import handleNewCodeBlock from './modifiers/handleNewCodeBlock';
import insertEmptyBlock from './modifiers/insertEmptyBlock';
import handleLink from './modifiers/handleLink';
import handleImage from './modifiers/handleImage';
import leaveList from './modifiers/leaveList';
import insertText from './modifiers/insertText';
import changeCurrentBlockType from './modifiers/changeCurrentBlockType';
import createLinkDecorator from './decorators/link';
import createImageDecorator from './decorators/image';
import {replaceText} from './utils';
import Link from './components/Link';
import Image from './components/Image';

function checkCharacterForState(editorState, character) {
  let newEditorState = handleBlockType(editorState, character);
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const key = selection.getStartKey();
  const currentBlock = contentState.getBlockForKey(key);
  const type = currentBlock.getType();
  if (editorState === newEditorState) {
    newEditorState = handleImage(editorState, character);
  }
  if (editorState === newEditorState) {
    newEditorState = handleLink(editorState, character);
  }
  if (editorState === newEditorState && type !== 'code-block') {
    newEditorState = handleInlineStyle(editorState, character);
  }
  return newEditorState;
}

function checkReturnForState(editorState, ev, {insertEmptyBlockOnReturnWithModifierKey}) {
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
  if (
    newEditorState === editorState &&
    insertEmptyBlockOnReturnWithModifierKey &&
    (ev.ctrlKey ||
      ev.shiftKey ||
      ev.metaKey ||
      ev.altKey ||
      (/^header-/.test(type) && selection.isCollapsed() && selection.getEndOffset() === text.length))
  ) {
    newEditorState = insertEmptyBlock(editorState);
  }
  if (newEditorState === editorState && type !== 'code-block' && /^```([\w-]+)?$/.test(text)) {
    newEditorState = handleNewCodeBlock(editorState);
  }
  if (newEditorState === editorState && type === 'code-block') {
    if (/```\s*$/.test(text)) {
      newEditorState = changeCurrentBlockType(newEditorState, type, text.replace(/\n```\s*$/, ''));
      newEditorState = insertEmptyBlock(newEditorState);
    } else {
      newEditorState = insertText(editorState, '\n');
    }
  }
  if (editorState === newEditorState) {
    newEditorState = handleInlineStyle(editorState, '\n');
  }
  return newEditorState;
}

const createMarkdownShortcutsPlugin = ({
  insertEmptyBlockOnReturnWithModifierKey = true,
  linkComponent = Link,
  imageComponent = Image,
} = {}) => {
  const config = {
    insertEmptyBlockOnReturnWithModifierKey,
    linkComponent,
    imageComponent,
  };

  const store = {};
  return {
    store,
    blockRenderMap: Map({
      'code-block': {
        element: 'code',
        wrapper: <pre spellCheck="false" />,
      },
    }).merge(checkboxBlockRenderMap),
    decorators: [createLinkDecorator(config, store), createImageDecorator(config, store)],
    initialize({setEditorState, getEditorState}) {
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

    blockRendererFn(block) {
      switch (block.getType()) {
        case CHECKABLE_LIST_ITEM: {
          return {
            component: CheckableListItem,
            props: {
              onChangeChecked: () =>
                store.setEditorState(CheckableListItemUtils.toggleChecked(store.getEditorState(), block)),
              checked: !!block.getData().get('checked'),
            },
          };
        }
        default:
          return null;
      }
    },
    onTab(ev) {
      const editorState = store.getEditorState();
      const newEditorState = adjustBlockDepth(editorState, ev);
      if (newEditorState !== editorState) {
        store.setEditorState(newEditorState);
        return 'handled';
      }
      return 'not-handled';
    },
    handleReturn(ev, editorState) {
      const newEditorState = checkReturnForState(editorState, ev, config);
      if (editorState !== newEditorState) {
        store.setEditorState(newEditorState);
        return 'handled';
      }
      return 'not-handled';
    },
    handleBeforeInput(character, editorState) {
      if (character.match(/[A-z0-9_*~`]/)) {
        return 'not-handled';
      }
      const newEditorState = checkCharacterForState(editorState, character);
      if (editorState !== newEditorState) {
        store.setEditorState(newEditorState);
        return 'handled';
      }
      return 'not-handled';
    },
    handlePastedText(text, html, editorState) {
      if (html) {
        return 'not-handled';
      }

      if (!text) {
        return 'not-handled';
      }

      let newEditorState = editorState;
      let buffer = [];
      for (let i = 0; i < text.length; i += 1) {
        // eslint-disable-line no-plusplus
        if (text[i].match(/[^A-z0-9_*~`]/)) {
          newEditorState = replaceText(newEditorState, buffer.join('') + text[i]);
          newEditorState = checkCharacterForState(newEditorState, text[i]);
          buffer = [];
        } else if (text[i].charCodeAt(0) === 10) {
          newEditorState = replaceText(newEditorState, buffer.join(''));
          const tmpEditorState = checkReturnForState(newEditorState, {}, config);
          if (newEditorState === tmpEditorState) {
            newEditorState = insertEmptyBlock(tmpEditorState);
          } else {
            newEditorState = tmpEditorState;
          }
          buffer = [];
        } else if (i === text.length - 1) {
          newEditorState = replaceText(newEditorState, buffer.join('') + text[i]);
          buffer = [];
        } else {
          buffer.push(text[i]);
        }
      }

      if (editorState !== newEditorState) {
        store.setEditorState(newEditorState);
        return 'handled';
      }
      return 'not-handled';
    },
  };
};

export default createMarkdownShortcutsPlugin;
