import { expect } from 'chai';
import sinon from 'sinon';
import createMarkdownShortcutsPlugin from '../';

describe('draft-js-markdown-shortcuts-plugin', () => {
  let plugin;
  beforeEach(() => {
    plugin = createMarkdownShortcutsPlugin({});
  });
  it('is loaded', () => {
    expect(createMarkdownShortcutsPlugin).to.be.a('function');
  });
  it('initialize', () => {
    const getEditorState = sinon.spy();
    const setEditorState = sinon.spy();
    plugin.initialize({ getEditorState, setEditorState });
    expect(plugin.store).to.deep.equal({
      getEditorState,
      setEditorState
    });
  });
});
