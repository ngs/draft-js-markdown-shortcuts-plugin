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
  }
});

export default createMarkdownShortcutsPlugin;
