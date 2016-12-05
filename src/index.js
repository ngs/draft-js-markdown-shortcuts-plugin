// import { getDefaultKeyBinding } from 'draft-js';
import createCheckboxDecorator from './checkboxDecorator';
import createHeadingDecorator from './headingDecorator';
import createImageDecorator from './imageDecorator';
import createLinkDecorator from './linkDecorator';
import createBoldDecorator from './boldDecorator';
import createEmphasisDecorator from './emphasisDecorator';
import createStriketroughDecorator from './strikethroughDecorator';
import createQuoteDecorator from './quoteDecorator';

const store = {};

const createMarkdownShortcutsPlugin = (config = {}) => ({
  decorators: [
    createImageDecorator(config, store),
    createCheckboxDecorator(config, store),
    createLinkDecorator(config, store),
    createBoldDecorator(config, store),
    createQuoteDecorator(config, store),
    createEmphasisDecorator(config, store),
    createStriketroughDecorator(config, store),
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
  },
  onChange(editorState) {
    // console.info(editorState.toJS());
    window.editorState = editorState;
    return editorState;
  }
});

export default createMarkdownShortcutsPlugin;
