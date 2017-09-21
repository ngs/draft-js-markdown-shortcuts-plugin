import sinon from "sinon";
import Draft, { EditorState, SelectionState, ContentBlock } from "draft-js";
import {
  CheckableListItem,
  CheckableListItemUtils,
} from "draft-js-checkable-list-item";

import { Map, List } from "immutable";
import createMarkdownPlugin from "../";

describe("draft-js-markdown-plugin", () => {
  afterEach(() => {
    /* eslint-disable no-underscore-dangle */
    createMarkdownPlugin.__ResetDependency__("adjustBlockDepth");
    createMarkdownPlugin.__ResetDependency__("handleBlockType");
    createMarkdownPlugin.__ResetDependency__("handleInlineStyle");
    createMarkdownPlugin.__ResetDependency__("handleNewCodeBlock");
    createMarkdownPlugin.__ResetDependency__("insertEmptyBlock");
    createMarkdownPlugin.__ResetDependency__("handleLink");
    createMarkdownPlugin.__ResetDependency__("handleImage");
    createMarkdownPlugin.__ResetDependency__("leaveList");
    createMarkdownPlugin.__ResetDependency__("changeCurrentBlockType");
    createMarkdownPlugin.__ResetDependency__("replaceText");
    createMarkdownPlugin.__ResetDependency__("checkReturnForState");
    /* eslint-enable no-underscore-dangle */
  });

  const createEditorState = (rawContent, rawSelection) => {
    const contentState = Draft.convertFromRaw(rawContent);
    return EditorState.forceSelection(
      EditorState.createWithContent(contentState),
      rawSelection
    );
  };

  let plugin;
  let store;
  let currentEditorState;
  let newEditorState;
  let currentRawContentState;
  let newRawContentState;
  let currentSelectionState;
  let subject;
  let event;

  let modifierSpy;

  [[], [{}]].forEach(args => {
    beforeEach(() => {
      modifierSpy = jest.fn(() => newEditorState);

      event = new window.KeyboardEvent("keydown");
      jest.spyOn(event, "preventDefault");
      currentSelectionState = new SelectionState({
        anchorKey: "item1",
        anchorOffset: 0,
        focusKey: "item1",
        focusOffset: 0,
        isBackward: false,
        hasFocus: true,
      });

      newRawContentState = {
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
      newEditorState = EditorState.createWithContent(
        Draft.convertFromRaw(newRawContentState)
      );

      store = {
        setEditorState: jest.fn(),
        getEditorState: jest.fn(() => {
          currentEditorState = createEditorState(
            currentRawContentState,
            currentSelectionState
          );
          return currentEditorState;
        }),
      };
      subject = null;
    });

    describe(args.length === 0 ? "without config" : "with config", () => {
      beforeEach(() => {
        plugin = createMarkdownPlugin(...args);
      });

      it("is loaded", () => {
        expect(typeof createMarkdownPlugin).toBe("function");
      });
      it("initialize", () => {
        plugin.initialize(store);
        expect(plugin.store).toEqual(store);
      });
      describe("handleReturn", () => {
        beforeEach(() => {
          subject = () =>
            plugin.handleReturn(event, store.getEditorState(), store);
        });
        it("does not handle", () => {
          currentRawContentState = {
            entityMap: {},
            blocks: [
              {
                key: "item1",
                text: "",
                type: "unstyled",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
            ],
          };
          expect(subject()).toBe("not-handled");
          expect(modifierSpy).not.toHaveBeenCalledTimes(1);
          expect(store.setEditorState).not.toHaveBeenCalled();
        });
        it("leaves from list", () => {
          createMarkdownPlugin.__Rewire__("leaveList", modifierSpy); // eslint-disable-line no-underscore-dangle
          currentRawContentState = {
            entityMap: {},
            blocks: [
              {
                key: "item1",
                text: "",
                type: "ordered-list-item",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
            ],
          };
          expect(subject()).toBe("handled");
          expect(modifierSpy).toHaveBeenCalledTimes(1);
          expect(store.setEditorState).toHaveBeenCalledWith(newEditorState);
        });
        const testInsertNewBlock = type => () => {
          createMarkdownPlugin.__Rewire__("insertEmptyBlock", modifierSpy); // eslint-disable-line no-underscore-dangle
          currentRawContentState = {
            entityMap: {},
            blocks: [
              {
                key: "item1",
                text: "Hello",
                type,
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
            ],
          };
          expect(subject()).toBe("handled");
          expect(modifierSpy).toHaveBeenCalledTimes(1);
          expect(store.setEditorState).toHaveBeenCalledWith(newEditorState);
        };
        ["one", "two", "three", "four", "five", "six"].forEach(level => {
          describe(`on header-${level}`, () => {
            it(
              "inserts new empty block",
              testInsertNewBlock(`header-${level}`)
            );
          });
        });
        ["ctrlKey", "shiftKey", "metaKey", "altKey"].forEach(key => {
          describe(`${key} is pressed`, () => {
            beforeEach(() => {
              const props = {};
              props[key] = true;
              event = new window.KeyboardEvent("keydown", props);
            });
            it("inserts new empty block", testInsertNewBlock("blockquote"));
          });
        });
        it("handles new code block", () => {
          createMarkdownPlugin.__Rewire__("handleNewCodeBlock", modifierSpy); // eslint-disable-line no-underscore-dangle
          currentRawContentState = {
            entityMap: {},
            blocks: [
              {
                key: "item1",
                text: "```",
                type: "unstyled",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
            ],
          };
          expect(subject()).toBe("handled");
          expect(modifierSpy).toHaveBeenCalledTimes(1);
          expect(store.setEditorState).toHaveBeenCalledWith(newEditorState);
        });
        it("handle code block closing", () => {
          createMarkdownPlugin.__Rewire__(
            "changeCurrentBlockType",
            modifierSpy
          ); // eslint-disable-line no-underscore-dangle
          currentRawContentState = {
            entityMap: {},
            blocks: [
              {
                key: "item1",
                text: "foo\n```",
                type: "code-block",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
            ],
          };
          expect(subject()).toBe("handled");
          expect(modifierSpy).toHaveBeenCalledTimes(1);
        });
        it("insert new line char from code-block", () => {
          createMarkdownPlugin.__Rewire__("insertText", modifierSpy); // eslint-disable-line no-underscore-dangle
          currentRawContentState = {
            entityMap: {},
            blocks: [
              {
                key: "item1",
                text: "const foo = a => a",
                type: "code-block",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
            ],
          };
          expect(subject()).toBe("handled");
          expect(modifierSpy).toHaveBeenCalledTimes(1);
          expect(store.setEditorState).toHaveBeenCalledWith(newEditorState);
        });
      });
      describe("blockStyleFn", () => {
        let type;
        beforeEach(() => {
          type = null;
          const getType = () => type;
          subject = () => plugin.blockStyleFn({ getType });
        });
        it("returns checkable-list-item", () => {
          type = "checkable-list-item";
          expect(subject()).toBe("checkable-list-item");
        });
        it("returns null", () => {
          type = "ordered-list-item";
          expect(subject()).toBeNull();
        });
      });
      describe("blockRendererFn", () => {
        let type;
        let data;
        let block;
        let spyOnChangeChecked;
        beforeEach(() => {
          type = null;
          data = {};
          spyOnChangeChecked = jest.spyOn(
            CheckableListItemUtils,
            "toggleChecked"
          );
          subject = () => {
            block = new ContentBlock({
              type,
              data: Map(data),
              key: "item1",
              characterList: List(),
            });
            return plugin.blockRendererFn(block, store);
          };
        });
        afterEach(() => {
          CheckableListItemUtils.toggleChecked.mockRestore();
        });
        it("returns renderer", () => {
          type = "checkable-list-item";
          data = { checked: true };
          const renderer = subject();
          expect(typeof renderer).toBe("object");
          expect(renderer.component).toBe(CheckableListItem);
          expect(typeof renderer.props.onChangeChecked).toBe("function");
          expect(renderer.props.checked).toBe(true);
          renderer.props.onChangeChecked();
          expect(spyOnChangeChecked).toHaveBeenCalledWith(
            currentEditorState,
            block
          );
        });
        it("returns null", () => {
          type = "ordered-list-item";
          expect(subject()).toBeNull();
        });
      });
      describe("onTab", () => {
        beforeEach(() => {
          subject = () => {
            createMarkdownPlugin.__Rewire__("adjustBlockDepth", modifierSpy); // eslint-disable-line no-underscore-dangle
            return plugin.onTab(event, store);
          };
        });
        describe("no changes", () => {
          it("returns handled", () => {
            expect(subject()).toBe("handled");
          });
          it("returns not-handled", () => {
            modifierSpy = jest.fn(() => currentEditorState);
            expect(subject()).toBe("not-handled");
          });
        });
      });
      describe("handleBeforeInput", () => {
        let character;
        beforeEach(() => {
          character = " ";
          subject = () =>
            plugin.handleBeforeInput(character, store.getEditorState(), store);
        });
        [
          "handleBlockType",
          "handleImage",
          "handleLink",
          "handleInlineStyle",
        ].forEach(modifier => {
          describe(modifier, () => {
            beforeEach(() => {
              createMarkdownPlugin.__Rewire__(modifier, modifierSpy); // eslint-disable-line no-underscore-dangle
            });
            it("returns handled", () => {
              expect(subject()).toBe("handled");
              expect(modifierSpy).toHaveBeenCalledWith(currentEditorState, " ");
            });
          });
        });
        describe("character is not a space", () => {
          beforeEach(() => {
            character = "x";
          });
          it("returns not-handled", () => {
            expect(subject()).toBe("not-handled");
          });
        });
        describe("no matching modifiers", () => {
          it("returns not-handled", () => {
            expect(subject()).toBe("not-handled");
          });
        });
      });
      describe("handlePastedText", () => {
        let pastedText;
        let html;
        beforeEach(() => {
          pastedText = `_hello world_
          Hello`;
          html = undefined;
          subject = () =>
            plugin.handlePastedText(
              pastedText,
              html,
              store.getEditorState(),
              store
            );
        });
        [
          "replaceText",
          // TODO(@mxstbr): This broke when switching mocha->jest, fix it!
          // 'insertEmptyBlock',
          "handleBlockType",
          "handleImage",
          "handleLink",
          "handleInlineStyle",
        ].forEach(modifier => {
          describe(modifier, () => {
            beforeEach(() => {
              createMarkdownPlugin.__Rewire__(modifier, modifierSpy); // eslint-disable-line no-underscore-dangle
            });
            it("returns handled", () => {
              expect(subject()).toBe("handled");
              expect(modifierSpy).toHaveBeenCalled();
            });
          });
        });
        describe("nothing in clipboard", () => {
          beforeEach(() => {
            pastedText = "";
          });
          it("returns not-handled", () => {
            expect(subject()).toBe("not-handled");
          });
        });
        describe("pasted just text", () => {
          beforeEach(() => {
            pastedText = "hello";
            createMarkdownPlugin.__Rewire__("replaceText", modifierSpy); // eslint-disable-line no-underscore-dangle
          });
          it("returns handled", () => {
            expect(subject()).toBe("handled");
            expect(modifierSpy).toHaveBeenCalledWith(
              currentEditorState,
              "hello"
            );
          });
        });
        describe("pasted just text with new line code", () => {
          beforeEach(() => {
            pastedText = "hello\nworld";
            const rawContentState = {
              entityMap: {},
              blocks: [
                {
                  key: "item1",
                  text: "",
                  type: "unstyled",
                  depth: 0,
                  inlineStyleRanges: [],
                  entityRanges: [],
                  data: {},
                },
              ],
            };
            const otherRawContentState = {
              entityMap: {},
              blocks: [
                {
                  key: "item2",
                  text: "H1",
                  type: "header-one",
                  depth: 0,
                  inlineStyleRanges: [],
                  entityRanges: [],
                  data: {},
                },
              ],
            };
            /* eslint-disable no-underscore-dangle */
            createMarkdownPlugin.__Rewire__("replaceText", () =>
              createEditorState(rawContentState, currentSelectionState)
            );
            createMarkdownPlugin.__Rewire__("checkReturnForState", () =>
              createEditorState(otherRawContentState, currentSelectionState)
            );
            /* eslint-enable no-underscore-dangle */
          });
          it("return handled", () => {
            expect(subject()).toBe("handled");
          });
        });
        describe("passed `html` argument", () => {
          beforeEach(() => {
            pastedText = "# hello";
            html = "<h1>hello</h1>";
          });
          it("returns not-handled", () => {
            expect(subject()).toBe("not-handled");
          });
        });
      });
    });
  });
});
