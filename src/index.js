import React from "react";
import {
  blockRenderMap as checkboxBlockRenderMap,
  CheckableListItem,
  CheckableListItemUtils,
  CHECKABLE_LIST_ITEM,
} from "draft-js-checkable-list-item";

import { Map, OrderedSet, is } from "immutable";
import CodeBlock from "./components/Code";
import {
  getDefaultKeyBinding,
  Modifier,
  EditorState,
  RichUtils,
  DefaultDraftInlineStyle,
} from "draft-js";
import adjustBlockDepth from "./modifiers/adjustBlockDepth";
import handleBlockType from "./modifiers/handleBlockType";
import handleInlineStyle from "./modifiers/handleInlineStyle";
import splitBlockAndChange from "./modifiers/splitBlockAndChange";
import handleNewCodeBlock from "./modifiers/handleNewCodeBlock";
import resetInlineStyle from "./modifiers/resetInlineStyle";
import insertEmptyBlock from "./modifiers/insertEmptyBlock";
import handleLink from "./modifiers/handleLink";
import handleImage from "./modifiers/handleImage";
import leaveList from "./modifiers/leaveList";
import insertText from "./modifiers/insertText";
import changeCurrentBlockType from "./modifiers/changeCurrentBlockType";
import createLinkDecorator from "./decorators/link";
import createImageDecorator from "./decorators/image";
import { replaceText, getCurrentLine } from "./utils";
import {
  CODE_BLOCK_REGEX,
  CODE_BLOCK_TYPE,
  ENTITY_TYPE,
  defaultInlineWhitelist,
  defaultBlockWhitelist,
} from "./constants";

const defaultLanguages = {
  bash: "Bash",
  c: "C",
  cpp: "C++",
  css: "CSS",
  go: "Go",
  html: "HTML",
  java: "Java",
  js: "JavaScript",
  kotlin: "Kotlin",
  mathml: "MathML",
  perl: "Perl",
  ruby: "Ruby",
  scala: "Scala",
  sql: "SQL",
  svg: "SVG",
  swift: "Swift",
};

const INLINE_STYLE_CHARACTERS = ["*", "_", "`", "~"];

const defaultRenderSelect = ({ options, onChange, selectedValue }) => (
  <select value={selectedValue} onChange={onChange}>
    {options.map(({ label, value }) => (
      <option key={value} value={value}>
        {label}
      </option>
    ))}
  </select>
);

function inLink(editorState) {
  const selection = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const block = contentState.getBlockForKey(selection.getAnchorKey());
  const entityKey = block.getEntityAt(selection.getFocusOffset());
  return (
    entityKey != null && contentState.getEntity(entityKey).getType() === "LINK"
  );
}

function inCodeBlock(editorState) {
  const startKey = editorState.getSelection().getStartKey();
  if (startKey) {
    const currentBlockType = editorState
      .getCurrentContent()
      .getBlockForKey(startKey)
      .getType();
    if (currentBlockType === "code-block") return true;
  }

  return false;
}

function checkCharacterForState(config, editorState, character) {
  let newEditorState = handleBlockType(
    config.features.block,
    editorState,
    character
  );
  if (
    editorState === newEditorState &&
    config.features.inline.includes("IMAGE")
  ) {
    newEditorState = handleImage(
      editorState,
      character,
      config.entityType.IMAGE
    );
  }
  if (
    editorState === newEditorState &&
    config.features.inline.includes("LINK")
  ) {
    newEditorState = handleLink(editorState, character, config.entityType.LINK);
  }
  if (
    newEditorState === editorState &&
    config.features.block.includes("CODE")
  ) {
    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const key = selection.getStartKey();
    const currentBlock = contentState.getBlockForKey(key);
    const text = currentBlock.getText();
    const type = currentBlock.getType();
    if (type !== "code-block" && CODE_BLOCK_REGEX.test(text))
      newEditorState = handleNewCodeBlock(editorState);
  }
  if (editorState === newEditorState) {
    newEditorState = handleInlineStyle(
      config.features.inline,
      editorState,
      character
    );
  }
  return newEditorState;
}

function checkReturnForState(config, editorState, ev) {
  let newEditorState = editorState;
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const isCollapsed = selection.isCollapsed();
  const key = selection.getStartKey();
  const endOffset = selection.getEndOffset();
  const currentBlock = contentState.getBlockForKey(key);
  const blockLength = currentBlock.getLength();
  const type = currentBlock.getType();
  const text = currentBlock.getText();

  if (/-list-item$/.test(type) && text === "") {
    newEditorState = leaveList(editorState);
  }

  const isHeader = /^header-/.test(type);
  const isBlockQuote = type === "blockquote";
  const isAtEndOfLine = endOffset === blockLength;
  const atEndOfHeader = isHeader && isAtEndOfLine;
  const atEndOfBlockQuote = isBlockQuote && isAtEndOfLine;

  if (
    newEditorState === editorState &&
    isCollapsed &&
    (atEndOfHeader || atEndOfBlockQuote)
  ) {
    // transform markdown (if we aren't in a codeblock that is)
    if (!inCodeBlock(editorState)) {
      newEditorState = checkCharacterForState(config, newEditorState, "\n");
    }
    if (newEditorState === editorState) {
      newEditorState = insertEmptyBlock(newEditorState);
    } else {
      newEditorState = RichUtils.toggleBlockType(newEditorState, type);
    }
  } else if (isCollapsed && (isHeader || isBlockQuote) && !isAtEndOfLine) {
    newEditorState = splitBlockAndChange(newEditorState);
  }
  if (
    newEditorState === editorState &&
    type !== "code-block" &&
    config.features.block.includes("CODE") &&
    CODE_BLOCK_REGEX.test(text)
  ) {
    newEditorState = handleNewCodeBlock(editorState);
  }
  if (newEditorState === editorState && type === "code-block") {
    if (/```\s*$/.test(text)) {
      newEditorState = changeCurrentBlockType(
        newEditorState,
        type,
        text.replace(/```\s*$/, "")
      );
      newEditorState = insertEmptyBlock(newEditorState);
    } else if (ev.shiftKey) {
      newEditorState = insertEmptyBlock(newEditorState);
    } else {
      newEditorState = insertText(editorState, "\n");
    }
  }

  return newEditorState;
}

const defaultConfig = {
  renderLanguageSelect: defaultRenderSelect,
  languages: defaultLanguages,
  features: {
    inline: defaultInlineWhitelist,
    block: defaultBlockWhitelist,
  },
  entityType: ENTITY_TYPE,
};

const createMarkdownPlugin = (_config = {}) => {
  const store = {};

  const config = {
    ...defaultConfig,
    ..._config,
    features: {
      ...defaultConfig.features,
      ..._config.features,
    },
    entityType: {
      ...defaultConfig.entityType,
      ..._config.entityType,
    },
  };

  return {
    store,
    blockRenderMap: Map({
      "code-block": {
        element: "code",
        wrapper: <pre spellCheck="false" />,
      },
    }).merge(checkboxBlockRenderMap),
    decorators: [
      createLinkDecorator({
        entityType: config.entityType.LINK,
      }),
      createImageDecorator({
        entityType: config.entityType.IMAGE,
      }),
    ],
    initialize({ setEditorState, getEditorState }) {
      store.setEditorState = setEditorState;
      store.getEditorState = getEditorState;
    },
    blockStyleFn(block) {
      switch (block.getType()) {
        case CHECKABLE_LIST_ITEM:
          return CHECKABLE_LIST_ITEM;
        default:
          break;
      }
      return null;
    },

    blockRendererFn(
      block,
      { setReadOnly, setEditorState, getEditorState, getEditorRef }
    ) {
      switch (block.getType()) {
        case CHECKABLE_LIST_ITEM: {
          return {
            component: CheckableListItem,
            props: {
              onChangeChecked: () =>
                setEditorState(
                  CheckableListItemUtils.toggleChecked(getEditorState(), block)
                ),
              checked: !!block.getData().get("checked"),
            },
          };
        }
        case CODE_BLOCK_TYPE: {
          return {
            component: CodeBlock,
            props: {
              setEditorState,
              renderLanguageSelect: config.renderLanguageSelect,
              languages: config.languages,
              setReadOnly,
              language: block.getData().get("language"),
              getEditorState,
            },
          };
        }

        default:
          return null;
      }
    },
    onTab(ev, { getEditorState, setEditorState }) {
      const editorState = getEditorState();
      const newEditorState = adjustBlockDepth(editorState, ev);
      if (newEditorState !== editorState) {
        setEditorState(newEditorState);
        return "handled";
      }
      return "not-handled";
    },
    handleReturn(ev, editorState, { setEditorState }) {
      if (inLink(editorState)) return "not-handled";

      let newEditorState = checkReturnForState(config, editorState, ev);
      const selection = newEditorState.getSelection();

      // exit code blocks
      if (
        inCodeBlock(editorState) &&
        !is(editorState.getImmutable(), newEditorState.getImmutable())
      ) {
        setEditorState(newEditorState);
        return "handled";
      }

      newEditorState = checkCharacterForState(config, newEditorState, "\n");
      let content = newEditorState.getCurrentContent();

      // if there are actually no changes but the editorState has a
      // current inline style we want to split the block
      if (
        is(editorState.getImmutable(), newEditorState.getImmutable()) &&
        editorState.getCurrentInlineStyle().size > 0
      ) {
        content = Modifier.splitBlock(content, selection);
      }

      newEditorState = resetInlineStyle(newEditorState);

      if (editorState !== newEditorState) {
        setEditorState(
          EditorState.push(newEditorState, content, "split-block")
        );
        return "handled";
      }

      return "not-handled";
    },
    handleBeforeInput(character, editorState, { setEditorState }) {
      // If we're in a code block - don't transform markdown
      if (inCodeBlock(editorState)) return "not-handled";

      // If we're in a link - don't transform markdown
      if (inLink(editorState)) return "not-handled";

      // Don't let users type two spaces after another
      if (character === " " && getCurrentLine(editorState).slice(-1) === " ")
        return "handled";

      const newEditorState = checkCharacterForState(
        config,
        editorState,
        character
      );
      if (editorState !== newEditorState) {
        setEditorState(newEditorState);
        return "handled";
      }
      return "not-handled";
    },
    handleKeyCommand(command, editorState, { setEditorState }) {
      switch (command) {
        case "backspace": {
          // When a styled block is the first thing in the editor,
          // you cannot delete it. Typing backspace only deletes the content
          // but never deletes the block styling.
          // This piece of code fixes the issue by changing the block type
          // to 'unstyled' if we're on the first block of the editor and it's empty
          const selection = editorState.getSelection();
          const currentBlockKey = selection.getStartKey();
          if (!currentBlockKey) return "not-handled";

          const content = editorState.getCurrentContent();
          const currentBlock = content.getBlockForKey(currentBlockKey);
          const firstBlock = content.getFirstBlock();
          if (firstBlock !== currentBlock) return "not-handled";

          const currentBlockType = currentBlock.getType();
          const isEmpty = currentBlock.getLength() === 0;
          if (!isEmpty || currentBlockType === "unstyled") return "not-handled";

          setEditorState(changeCurrentBlockType(editorState, "unstyled", ""));
          return "handled";
        }
        default: {
          return "not-handled";
        }
      }
    },
    handlePastedText(text, html, editorState, { setEditorState }) {
      if (html) {
        return "not-handled";
      }
      // If we're in a code block don't add markdown to it
      if (inCodeBlock(editorState)) return "not-handled";
      let newEditorState = editorState;
      let buffer = [];
      for (let i = 0; i < text.length; i++) {
        // eslint-disable-line no-plusplus
        if (INLINE_STYLE_CHARACTERS.indexOf(text[i]) >= 0) {
          newEditorState = replaceText(
            newEditorState,
            buffer.join("") + text[i]
          );
          newEditorState = checkCharacterForState(
            config,
            newEditorState,
            text[i]
          );
          buffer = [];
        } else if (text[i].charCodeAt(0) === 10) {
          newEditorState = replaceText(newEditorState, buffer.join(""));
          const tmpEditorState = checkReturnForState(
            config,
            newEditorState,
            {}
          );
          if (newEditorState === tmpEditorState) {
            newEditorState = insertEmptyBlock(tmpEditorState);
          } else {
            newEditorState = tmpEditorState;
          }
          buffer = [];
        } else if (i === text.length - 1) {
          newEditorState = replaceText(
            newEditorState,
            buffer.join("") + text[i]
          );
          buffer = [];
        } else {
          buffer.push(text[i]);
        }
      }

      if (editorState !== newEditorState) {
        setEditorState(newEditorState);
        return "handled";
      }
      return "not-handled";
    },
  };
};

export default createMarkdownPlugin;
