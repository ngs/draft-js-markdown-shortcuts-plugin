import { expect } from 'chai';
import sinon from 'sinon';
import Draft, { EditorState, SelectionState } from 'draft-js';
import insertEmptyBlock from '../insertEmptyBlock';

describe('insertEmptyBlock', () => {
  before(() => {
    sinon.stub(Draft, 'genKey').returns('item2');
  });
  after(() => {
    Draft.genKey.restore();
  });
  const firstBlock = {
    key: 'item1',
    text: 'asdf',
    type: 'unstyled',
    depth: 0,
    inlineStyleRanges: [{
      length: 2,
      offset: 1,
      style: 'ITALIC'
    }],
    entityRanges: [],
    data: { foo: 'bar' }
  };
  const beforeRawContentState = {
    entityMap: {},
    blocks: [firstBlock]
  };
  const afterRawContentState = {
    entityMap: {},
    blocks: [firstBlock, {
      key: 'item2',
      text: '',
      type: 'header-one',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: { bar: 'baz' }
    }]
  };
  const contentState = Draft.convertFromRaw(beforeRawContentState);
  const selection = new SelectionState({
    anchorKey: 'item1',
    anchorOffset: 4,
    focusKey: 'item1',
    focusOffset: 4,
    isBackward: false,
    hasFocus: true
  });
  const editorState = EditorState.forceSelection(
    EditorState.createWithContent(contentState), selection);
  it('creates new code block', () => {
    const newEditorState = insertEmptyBlock(editorState, 'header-one', { bar: 'baz' });
    expect(newEditorState).not.to.equal(editorState);
    expect(
      Draft.convertToRaw(newEditorState.getCurrentContent())
    ).to.deep.equal(
      afterRawContentState
    );
  });
});
