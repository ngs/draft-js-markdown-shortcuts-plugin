import { getDefaultKeyBinding } from 'draft-js';
import createCheckboxDecorator from './checkboxDecorator';

const store = {};

const createMarkdownShortcutsPlugin = (config = {}) => ({
  decorators: [
    createCheckboxDecorator(config, store)
  ],
  initialize: (props) => {
    const { getEditorState, setEditorState, getEditorRef } = props;
    store.getEditorState = getEditorState;
    store.setEditorState = setEditorState;
    store.getEditorRef = getEditorRef;
  },
  handleReturn(e) {
    console.info(e);
    return 'not-handled';
  }
});

export default createMarkdownShortcutsPlugin;
