import findWithRegex from 'find-with-regex';
import { strikethrough as strikethroughRE } from './regexp';

const findStrikethrough = (contentBlock, callback) => {
  findWithRegex(strikethroughRE, contentBlock, callback);
};

export default findStrikethrough;
