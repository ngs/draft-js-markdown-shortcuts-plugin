// import { getDefaultKeyBinding } from 'draft-js';
import createCheckboxDecorator from './checkboxDecorator';
import createHeadingDecorator from './headingDecorator';
import createLinkDecorator from './linkDecorator';

const store = {};

const createMarkdownShortcutsPlugin = (config = {}) => ({
  decorators: [
    createCheckboxDecorator(config, store),
    createLinkDecorator(config, store),
    createHeadingDecorator({ level: 1 }, store),
    createHeadingDecorator({ level: 2 }, store),
    createHeadingDecorator({ level: 3 }, store),
    createHeadingDecorator({ level: 4 }, store),
    createHeadingDecorator({ level: 5 }, store),
    createHeadingDecorator({ level: 6 }, store),
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
