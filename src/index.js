import {
  blockRenderMap, CheckableListItem, CheckableListItemUtils, CHECKABLE_LIST_ITEM
} from 'draft-js-checkable-list-item';

import adjustBlockDepth from './modifiers/adjustBlockDepth';
import handleBlockType from './modifiers/handleBlockType';
import handleInlineStyle from './modifiers/handleInlineStyle';
import handleNewCodeBlock from './modifiers/handleNewCodeBlock';
import insertEmptyBlock from './modifiers/insertEmptyBlock';
import handleLink from './modifiers/handleLink';
import handleImage from './modifiers/handleImage';
import createLinkDecorator from './decorators/link';
import createImageDecorator from './decorators/image';

const createMarkdownShortcutsPlugin = (config = {}) => {
  const store = {};
  return {
    blockRenderMap,
    decorators: [
      createLinkDecorator(config, store),
      createImageDecorator(config, store)
    ],
    initialize({ setEditorState, getEditorState }) {
      store.setEditorState = setEditorState;
      store.getEditorState = getEditorState;
    },
    handleReturn(ev, { setEditorState, getEditorState }) {
      const editorState = getEditorState();
      let newEditorState = handleNewCodeBlock(editorState);
      if (editorState === newEditorState && (ev.ctrlKey || ev.shiftKey || ev.metaKey || ev.altKey)) {
        newEditorState = insertEmptyBlock(editorState);
      }
      if (editorState !== newEditorState) {
        setEditorState(newEditorState);
        return 'handled';
      }
      return 'not-handled';
    },
    blockStyleFn(block) {
      if (block.getType() === CHECKABLE_LIST_ITEM) {
        return CHECKABLE_LIST_ITEM;
      }
      return null;
    },
    blockRendererFn(block, { setEditorState, getEditorState }) {
      if (block.getType() === CHECKABLE_LIST_ITEM) {
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
      return null;
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
}
};

export default createMarkdownShortcutsPlugin;
