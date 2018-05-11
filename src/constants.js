import { CHECKABLE_LIST_ITEM } from "draft-js-checkable-list-item";

export const CODE_BLOCK_REGEX = /^```([\w-]+)?\s*$/;

export const inlineMatchers = {
  BOLD: [/\*(.+)\*$/g],
  ITALIC: [/_(.+)_$/g],
  CODE: [/`([^`]+)`$/g],
  STRIKETHROUGH: [/~(.+)~$/g],
};

export const CODE_BLOCK_TYPE = "code-block";

export const ENTITY_TYPE = {
  IMAGE: "IMG",
  LINK: "LINK",
};

export const defaultInlineWhitelist = [
  "BOLD",
  "ITALIC",
  "CODE",
  "STRIKETHROUGH",
  "LINK",
  "IMAGE",
];

export const defaultBlockWhitelist = [
  "CODE",
  "header-one",
  "header-two",
  "header-three",
  "header-four",
  "header-five",
  "header-six",
  "ordered-list-item",
  "unordered-list-item",
  CHECKABLE_LIST_ITEM,
  "blockquote",
];
