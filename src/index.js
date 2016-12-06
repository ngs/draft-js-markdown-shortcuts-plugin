import React from 'react';
import {
  blockRenderMap as checkboxBlockRenderMap, CheckableListItem, CheckableListItemUtils, CHECKABLE_LIST_ITEM
} from 'draft-js-checkable-list-item';
import PrismDecorator from 'draft-js-prism';

import { Map } from 'immutable';

import adjustBlockDepth from './modifiers/adjustBlockDepth';
import handleBlockType from './modifiers/handleBlockType';
import handleInlineStyle from './modifiers/handleInlineStyle';
import handleNewCodeBlock from './modifiers/handleNewCodeBlock';
import insertEmptyBlock from './modifiers/insertEmptyBlock';
import handleLink from './modifiers/handleLink';
import handleImage from './modifiers/handleImage';
import leaveList from './modifiers/leaveList';
import createLinkDecorator from './decorators/link';
import createImageDecorator from './decorators/image';


const createMarkdownShortcutsPlugin = (config = {}) => {
  const store = {};
  return {
    blockRenderMap: Map({
      'code-block': {
        element: 'code',
        wrapper: <pre spellCheck={'false'} />
      }
    }).merge(checkboxBlockRenderMap),
    decorators: [
      createLinkDecorator(config, store),
      createImageDecorator(config, store),
      new PrismDecorator({
        getSyntax(block) {
          return block.getData().get('language');
        },
        render({ type, children }) {
          return <span className={`prism-token token ${type}`}>{children}</span>;
        }
      })
    ],
    initialize({ setEditorState, getEditorState }) {
      store.setEditorState = setEditorState;
      store.getEditorState = getEditorState;
    },
    handleReturn(ev, { setEditorState, getEditorState }) {
      const editorState = getEditorState();
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
      if (newEditorState === editorState) {
        newEditorState = handleNewCodeBlock(editorState);
      }
      if (editorState !== newEditorState) {
        setEditorState(newEditorState);
        return 'handled';
      }
      return 'not-handled';
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
    handleBeforeInput(character, { getEditorState, setEditorState }) {
      if (character !== ' ') {
        return 'not-handled';
      }
      const editorState = getEditorState();
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
      if (editorState !== newEditorState) {
        setEditorState(newEditorState);
        return 'handled';
      }
      return 'not-handled';
    }
  };
};

export default createMarkdownShortcutsPlugin;
