import Draft, { EditorState, SelectionState } from "draft-js";
import insertEmptyBlock from "../modifiers/insertEmptyBlock";
import { addText, replaceText } from "../utils";

describe("utils test", () => {
  it("is loaded", () => {
    expect(typeof addText).toBe("function");
    expect(typeof replaceText).toBe("function");
  });

  const newRawContentState = {
    entityMap: {},
    blocks: [
      {
        key: "item1",
        text: "altered!!",
        type: "unstyled",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
    ],
  };

  it("should addText", () => {
    let newEditorState = EditorState.createWithContent(
      Draft.convertFromRaw(newRawContentState)
    );
    const randomText = Date.now().toString(32);
    newEditorState = insertEmptyBlock(newEditorState);
    newEditorState = addText(newEditorState, randomText);
    const currentContent = newEditorState.getCurrentContent();
    expect(currentContent.hasText()).toBe(true);
    const lastBlock = currentContent.getLastBlock();
    expect(lastBlock.getText()).toBe(randomText);
  });

  it("should replaceText", () => {
    let newEditorState = EditorState.createWithContent(
      Draft.convertFromRaw(newRawContentState)
    );
    const randomText = Date.now().toString(32);
    let currentContent = newEditorState.getCurrentContent();
    let lastBlock = currentContent.getLastBlock();
    const newSelection = new SelectionState({
      anchorKey: lastBlock.getKey(),
      anchorOffset: 0,
      focusKey: lastBlock.getKey(),
      focusOffset: lastBlock.getText().length,
    });
    newEditorState = EditorState.forceSelection(newEditorState, newSelection);

    newEditorState = replaceText(newEditorState, randomText);
    currentContent = newEditorState.getCurrentContent();
    expect(currentContent.hasText()).toBe(true);
    lastBlock = currentContent.getLastBlock();
    expect(lastBlock.getText()).toBe(randomText);
    const firstBlock = currentContent.getFirstBlock();
    expect(firstBlock.getText()).toBe(randomText);
  });
});
