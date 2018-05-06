import Draft, { EditorState, SelectionState } from "draft-js";
import { ENTITY_TYPE } from "../../constants";
import insertImage from "../insertImage";

jest.mock("draft-js/lib/generateRandomKey", () => {
  let count = 0;
  return () => {
    return `key${count++}`;
  };
});

describe("insertImage", () => {
  const markup =
    '![bar](http://cultofthepartyparrot.com/parrots/aussieparrot.gif "party")';
  const text = `foo ${markup} baz`;
  const beforeRawContentState = {
    entityMap: {},
    blocks: [
      {
        key: "item1",
        text,
        type: "unstyled",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
    ],
  };
  const afterRawContentState = {
    blocks: [
      {
        data: {},
        depth: 0,
        entityRanges: [],
        inlineStyleRanges: [],
        key: "item1",
        text: "foo ",
        type: "unstyled",
      },
      {
        data: {},
        depth: 0,
        entityRanges: [{ key: 0, length: 1, offset: 0 }],
        inlineStyleRanges: [],
        key: "key0",
        text: " ",
        type: "atomic",
      },
      {
        data: {},
        depth: 0,
        entityRanges: [],
        inlineStyleRanges: [],
        key: "key4",
        text: "  baz",
        type: "unstyled",
      },
    ],
    entityMap: {
      0: {
        data: {
          alt: "bar",
          src: "http://cultofthepartyparrot.com/parrots/aussieparrot.gif",
          title: "party",
        },
        mutability: "IMMUTABLE",
        type: "IMG",
      },
    },
  };

  const selection = new SelectionState({
    anchorKey: "item1",
    anchorOffset: 6,
    focusKey: "item1",
    focusOffset: 6,
    isBackward: false,
    hasFocus: true,
  });
  const contentState = Draft.convertFromRaw(beforeRawContentState);
  const editorState = EditorState.forceSelection(
    EditorState.createWithContent(contentState),
    selection
  );
  it("converts block type", () => {
    const matchArr = [
      markup,
      "bar",
      "http://cultofthepartyparrot.com/parrots/aussieparrot.gif",
      "party",
    ];
    matchArr.index = 4;
    matchArr.input = text;
    const newEditorState = insertImage(
      editorState,
      matchArr,
      ENTITY_TYPE.IMAGE
    );
    expect(newEditorState).not.toEqual(editorState);
    expect(Draft.convertToRaw(newEditorState.getCurrentContent())).toEqual(
      afterRawContentState
    );
  });
});
