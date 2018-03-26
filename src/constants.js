export const CODE_BLOCK_REGEX = /^```([\w-]+)?\s*$/;

export const inlineMatchers = {
  BOLD: [/\*\*([^(?**)]+)\*\*/g, /__([^(?:__)]+)__/g],
  ITALIC: [/\*([^*]+)\*/g, /_([^_]+)_/g],
  CODE: [/`([^`]+)`/g],
  STRIKETHROUGH: [/~~([^(?:~~)]+)~~/g],
};

export const CODE_BLOCK_TYPE = "code-block";
