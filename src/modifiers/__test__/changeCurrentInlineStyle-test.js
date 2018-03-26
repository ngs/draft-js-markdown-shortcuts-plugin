import Draft, { EditorState, SelectionState } from "draft-js";
import changeCurrentInlineStyle from "../changeCurrentInlineStyle";

describe("changeCurrentInlineStyle", () => {
  const rawContentState = (text, inlineStyleRanges) => ({
    entityMap: {},
    blocks: [
      {
        key: "item1",
        text,
        type: "unstyled",
        depth: 0,
        inlineStyleRanges,
        entityRanges: [],
        data: {},
      },
    ],
  });
  const selectionState = new SelectionState({
    anchorKey: "item1",
    anchorOffset: 5,
    focusKey: "item1",
    focusOffset: 5,
    isBackward: false,
    hasFocus: true,
  });
  const createEditorState = (...args) => {
    const contentState = Draft.convertFromRaw(rawContentState(...args));
    return EditorState.forceSelection(
      EditorState.createWithContent(contentState),
      selectionState
    );
  };
  it("changes block type", () => {
    const text = "foo `bar` baz";
    const editorState = createEditorState(text, []);
    const matchArr = ["`bar`", "bar"];
    matchArr.index = 4;
    matchArr.input = text;
    const newEditorState = changeCurrentInlineStyle(
      editorState,
      matchArr,
      "CODE"
    );
    expect(newEditorState).not.toEqual(editorState);
    expect(Draft.convertToRaw(newEditorState.getCurrentContent())).toEqual(
      rawContentState(
        "foo bar  baz",
        [
          {
            length: 3,
            offset: 4,
            style: "CODE",
          },
        ],
        "CODE"
      )
    );
  });
  it("inserts the character at the end", () => {
    const text = "foo `bar` baz";
    const editorState = createEditorState(text, []);
    const matchArr = ["`bar`", "bar"];
    matchArr.index = 4;
    matchArr.input = text;
    const newEditorState = changeCurrentInlineStyle(
      editorState,
      matchArr,
      "CODE",
      "\n"
    );
    expect(newEditorState).not.toEqual(editorState);
    const contentState = Draft.convertToRaw(newEditorState.getCurrentContent());
    expect(contentState.blocks.length).toBe(2);
    expect(contentState.blocks[0].text).toEqual("foo bar");
    expect(contentState.blocks[0].inlineStyleRanges).toEqual([
      { offset: 4, length: 3, style: "CODE" },
    ]);
    expect(contentState.blocks[1].text).toEqual(" baz");
  });
});
