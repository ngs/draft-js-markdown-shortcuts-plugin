/* eslint-disable no-unused-vars */

import Draft, { EditorState, SelectionState } from "draft-js";
import handleInlineStyle from "../handleInlineStyle";
import { defaultInlineWhitelist } from "../../constants";

describe("handleInlineStyle", () => {
  describe("no markup", () => {
    const rawContentState = {
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
    const contentState = Draft.convertFromRaw(rawContentState);
    const selection = new SelectionState({
      anchorKey: "item1",
      anchorOffset: 6,
      focusKey: "item1",
      focusOffset: 6,
      isBackward: false,
      hasFocus: true,
    });
    const editorState = EditorState.forceSelection(
      EditorState.createWithContent(contentState),
      selection
    );
    it("does not convert block type", () => {
      const newEditorState = handleInlineStyle(
        defaultInlineWhitelist,
        editorState,
        " "
      );
      expect(newEditorState).toEqual(editorState);
      expect(Draft.convertToRaw(newEditorState.getCurrentContent())).toEqual(
        rawContentState
      );
    });
  });

  const testCases = {
    "converts a mix of code, bold and italic and strikethrough in one go": {
      before: {
        entityMap: {},
        blocks: [
          {
            key: "item1",
            text: "`h~~el**lo *inline~~***` style",
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
        ],
      },
      after: {
        entityMap: {},
        blocks: [
          {
            key: "item1",
            text: "hello inline  style",
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [
              {
                length: 12,
                offset: 0,
                style: "CODE",
              },
              {
                length: 11,
                offset: 1,
                style: "STRIKETHROUGH",
              },
              {
                length: 9,
                offset: 3,
                style: "BOLD",
              },
              {
                length: 6,
                offset: 6,
                style: "ITALIC",
              },
            ],
            entityRanges: [],
            data: {},
          },
        ],
      },
      selection: new SelectionState({
        anchorKey: "item1",
        anchorOffset: 24,
        focusKey: "item1",
        focusOffset: 24,
        isBackward: false,
        hasFocus: true,
      }),
    },

    "converts to bold with astarisks": {
      before: {
        entityMap: {},
        blocks: [
          {
            key: "item1",
            text: "hello **inline** style",
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
        ],
      },
      after: {
        entityMap: {},
        blocks: [
          {
            key: "item1",
            text: "hello inline  style",
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [
              {
                length: 6,
                offset: 6,
                style: "BOLD",
              },
            ],
            entityRanges: [],
            data: {},
          },
        ],
      },
      selection: new SelectionState({
        anchorKey: "item1",
        anchorOffset: 16,
        focusKey: "item1",
        focusOffset: 16,
        isBackward: false,
        hasFocus: true,
      }),
    },
    "converts semicolons to bold with astarisks": {
      before: {
        entityMap: {},
        blocks: [
          {
            key: "item1",
            text: "hello **TL;DR:** style",
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
        ],
      },
      after: {
        entityMap: {},
        blocks: [
          {
            key: "item1",
            text: "hello TL;DR:  style",
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [
              {
                length: 6,
                offset: 6,
                style: "BOLD",
              },
            ],
            entityRanges: [],
            data: {},
          },
        ],
      },
      selection: new SelectionState({
        anchorKey: "item1",
        anchorOffset: 16,
        focusKey: "item1",
        focusOffset: 16,
        isBackward: false,
        hasFocus: true,
      }),
    },
    "converts to bold with underscores": {
      before: {
        entityMap: {},
        blocks: [
          {
            key: "item1",
            text: "hello __inline__ style",
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
        ],
      },
      after: {
        entityMap: {},
        blocks: [
          {
            key: "item1",
            text: "hello inline  style",
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [
              {
                length: 6,
                offset: 6,
                style: "BOLD",
              },
            ],
            entityRanges: [],
            data: {},
          },
        ],
      },
      selection: new SelectionState({
        anchorKey: "item1",
        anchorOffset: 16,
        focusKey: "item1",
        focusOffset: 16,
        isBackward: false,
        hasFocus: true,
      }),
    },
    "converts to italic with astarisk": {
      before: {
        entityMap: {},
        blocks: [
          {
            key: "item1",
            text: "hello *inline* style",
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
        ],
      },
      after: {
        entityMap: {},
        blocks: [
          {
            key: "item1",
            text: "hello inline  style",
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [
              {
                length: 6,
                offset: 6,
                style: "ITALIC",
              },
            ],
            entityRanges: [],
            data: {},
          },
        ],
      },
      selection: new SelectionState({
        anchorKey: "item1",
        anchorOffset: 14,
        focusKey: "item1",
        focusOffset: 14,
        isBackward: false,
        hasFocus: true,
      }),
    },
    "converts to italic with underscore": {
      before: {
        entityMap: {},
        blocks: [
          {
            key: "item1",
            text: "hello _inline_ style",
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
        ],
      },
      after: {
        entityMap: {},
        blocks: [
          {
            key: "item1",
            text: "hello inline  style",
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [
              {
                length: 6,
                offset: 6,
                style: "ITALIC",
              },
            ],
            entityRanges: [],
            data: {},
          },
        ],
      },
      selection: new SelectionState({
        anchorKey: "item1",
        anchorOffset: 14,
        focusKey: "item1",
        focusOffset: 14,
        isBackward: false,
        hasFocus: true,
      }),
    },
    "combines to italic and bold with astarisks": {
      before: {
        entityMap: {},
        blocks: [
          {
            key: "item1",
            text: "hello **inline** style",
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [
              {
                length: 3,
                offset: 2,
                style: "ITALIC",
              },
            ],
            entityRanges: [],
            data: {},
          },
        ],
      },
      after: {
        entityMap: {},
        blocks: [
          {
            key: "item1",
            text: "hello inline  style",
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [
              {
                length: 3,
                offset: 2,
                style: "ITALIC",
              },
              {
                length: 6,
                offset: 6,
                style: "BOLD",
              },
            ],
            entityRanges: [],
            data: {},
          },
        ],
      },
      selection: new SelectionState({
        anchorKey: "item1",
        anchorOffset: 16,
        focusKey: "item1",
        focusOffset: 16,
        isBackward: false,
        hasFocus: true,
      }),
    },
    "converts to code with backquote": {
      before: {
        entityMap: {},
        blocks: [
          {
            key: "item1",
            text: "hello `inline` style",
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
        ],
      },
      after: {
        entityMap: {},
        blocks: [
          {
            key: "item1",
            text: "hello inline  style",
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [
              {
                length: 6,
                offset: 6,
                style: "CODE",
              },
            ],
            entityRanges: [],
            data: {},
          },
        ],
      },
      selection: new SelectionState({
        anchorKey: "item1",
        anchorOffset: 14,
        focusKey: "item1",
        focusOffset: 14,
        isBackward: false,
        hasFocus: true,
      }),
    },
    "converts to strikethrough with tildes": {
      before: {
        entityMap: {},
        blocks: [
          {
            key: "item1",
            text: "hello ~~inline~~ style",
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
        ],
      },
      after: {
        entityMap: {},
        blocks: [
          {
            key: "item1",
            text: "hello inline  style",
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [
              {
                length: 6,
                offset: 6,
                style: "STRIKETHROUGH",
              },
            ],
            entityRanges: [],
            data: {},
          },
        ],
      },
      selection: new SelectionState({
        anchorKey: "item1",
        anchorOffset: 16,
        focusKey: "item1",
        focusOffset: 16,
        isBackward: false,
        hasFocus: true,
      }),
    },

    // combine tests

    "combines to italic and bold with underscores": {
      before: {
        entityMap: {},
        blocks: [
          {
            key: "item1",
            text: "hello __inline__ style",
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [
              {
                length: 4,
                offset: 5,
                style: "ITALIC",
              },
            ],
            entityRanges: [],
            data: {},
          },
        ],
      },
      after: {
        entityMap: {},
        blocks: [
          {
            key: "item1",
            text: "hello inline  style",
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [
              {
                length: 2,
                offset: 5,
                style: "ITALIC",
              },
              {
                length: 6,
                offset: 6,
                style: "BOLD",
              },
            ],
            entityRanges: [],
            data: {},
          },
        ],
      },
      selection: new SelectionState({
        anchorKey: "item1",
        anchorOffset: 16,
        focusKey: "item1",
        focusOffset: 16,
        isBackward: false,
        hasFocus: true,
      }),
    },

    "combines to bold and italic with underscores": {
      before: {
        entityMap: {},
        blocks: [
          {
            key: "item1",
            text: "hello _inline_ style",
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [
              {
                length: 5,
                offset: 5,
                style: "BOLD",
              },
            ],
            entityRanges: [],
            data: {},
          },
        ],
      },
      after: {
        entityMap: {},
        blocks: [
          {
            key: "item1",
            text: "hello inline  style",
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [
              {
                length: 4,
                offset: 5,
                style: "BOLD",
              },
              {
                length: 6,
                offset: 6,
                style: "ITALIC",
              },
            ],
            entityRanges: [],
            data: {},
          },
        ],
      },
      selection: new SelectionState({
        anchorKey: "item1",
        anchorOffset: 14,
        focusKey: "item1",
        focusOffset: 14,
        isBackward: false,
        hasFocus: true,
      }),
    },
  };
  Object.keys(testCases).forEach(k => {
    describe(k, () => {
      const testCase = testCases[k];
      const { before, after, selection, character = " " } = testCase;
      const contentState = Draft.convertFromRaw(before);
      const editorState = EditorState.forceSelection(
        EditorState.createWithContent(contentState),
        selection
      );

      const wrongSelectionState = selection.merge({
        anchorOffset: 0,
        focusOffset: 0,
      });
      const sameEditorState = EditorState.forceSelection(
        editorState,
        wrongSelectionState
      );

      it("does not convert markdown to style or block type if selection is at the wrong place", () => {
        const newEditorState = handleInlineStyle(
          defaultInlineWhitelist,
          sameEditorState,
          character
        );
        expect(newEditorState).toEqual(sameEditorState);
        expect(Draft.convertToRaw(newEditorState.getCurrentContent())).toEqual(
          before
        );
      });

      it("converts markdown to style or block type", () => {
        const newEditorState = handleInlineStyle(
          defaultInlineWhitelist,
          editorState,
          character
        );
        expect(newEditorState).not.toEqual(editorState);
        expect(Draft.convertToRaw(newEditorState.getCurrentContent())).toEqual(
          after
        );
      });
    });
  });
});
