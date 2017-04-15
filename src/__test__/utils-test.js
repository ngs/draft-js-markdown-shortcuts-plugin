import { expect } from 'chai';
import Draft, { EditorState } from 'draft-js';
import { addText, addEmptyBlock } from '../utils';

describe('utils test', () => {
  it('is loaded', () => {
    expect(addText).to.be.a('function');
    expect(addEmptyBlock).to.be.a('function');
  });

  const newRawContentState = {
    entityMap: {},
    blocks: [{
      key: 'item1',
      text: 'altered!!',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {}
    }]
  };
  it('should add empty block', () => {
    let newEditorState = EditorState.createWithContent(Draft.convertFromRaw(newRawContentState));
    const initialBlockSize = newEditorState.getCurrentContent().getBlockMap().size;
    const randomBlockSize = Math.floor((Math.random() * 50) + 1); // random number bettween 1 to 50
    for (let i = 0; i < randomBlockSize; i++) { // eslint-disable-line
      newEditorState = addEmptyBlock(newEditorState);
    }
    const finalBlockSize = newEditorState.getCurrentContent().getBlockMap().size;
    expect(finalBlockSize - initialBlockSize).to.equal(randomBlockSize);

    const lastBlock = newEditorState.getCurrentContent().getLastBlock();
    expect(lastBlock.getType()).to.equal('unstyled');
    expect(lastBlock.getText()).to.have.lengthOf(0);
  });

  it('should addText', () => {
    let newEditorState = EditorState.createWithContent(Draft.convertFromRaw(newRawContentState));
    const randomText = Date.now().toString(32);
    newEditorState = addEmptyBlock(newEditorState);
    newEditorState = addText(newEditorState, randomText);
    const currentContent = newEditorState.getCurrentContent();
    expect(currentContent.hasText()).to.equal(true);
    const lastBlock = currentContent.getLastBlock();
    expect(lastBlock.getText()).to.equal(randomText);
  });
});
