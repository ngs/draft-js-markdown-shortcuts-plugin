import sinon from "sinon";
import Draft, { EditorState, SelectionState } from "draft-js";
import handleLink from "../handleLink";

describe("handleLink", () => {
  let beforeRawContentState;
  let afterRawContentState;
  let selection;
  let fakeInsertLink;

  afterAll(() => {
    handleLink.__ResetDependency__("../insertLink"); // eslint-disable-line no-underscore-dangle
  });

  const createEditorState = text => {
    afterRawContentState = {
      entityMap: {},
      blocks: [
        {
          key: "item1",
          text: "Test",
          type: "unstyled",
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
          data: {},
        },
      ],
    };

    beforeRawContentState = {
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

    selection = new SelectionState({
      anchorKey: "item1",
      anchorOffset: text.length - 1,
      focusKey: "item1",
      focusOffset: text.length - 1,
      isBackward: false,
      hasFocus: true,
    });

    const contentState = Draft.convertFromRaw(beforeRawContentState);
    const editorState = EditorState.forceSelection(
      EditorState.createWithContent(contentState),
      selection
    );
    const newContentState = Draft.convertFromRaw(afterRawContentState);
    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      "insert-image"
    );

    fakeInsertLink = jest.fn(() => newEditorState);

    handleLink.__Rewire__("insertLink", fakeInsertLink); // eslint-disable-line no-underscore-dangle

    return editorState;
  };

  [
    ["if href only", "[hello](http://cultofthepartyparrot.com/)"],
    ["if href and title", '[hello](http://cultofthepartyparrot.com/ "world")'],
  ].forEach(([condition, text]) => {
    describe(condition, () => {
      it("returns new editor state", () => {
        const editorState = createEditorState(text);
        const newEditorState = handleLink(editorState, " ");
        expect(newEditorState).not.toEqual(editorState);
        expect(Draft.convertToRaw(newEditorState.getCurrentContent())).toEqual(
          afterRawContentState
        );
        expect(fakeInsertLink).toHaveBeenCalledTimes(1);
      });
    });
  });
  describe("if does not match", () => {
    it("returns old editor state", () => {
      const editorState = createEditorState("yo");
      const newEditorState = handleLink(editorState, " ");
      expect(newEditorState).toEqual(editorState);
      expect(fakeInsertLink).not.toHaveBeenCalled();
    });
  });
});
