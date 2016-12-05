import findWithRegex from 'find-with-regex';
import { quote as quoteRE } from './regexp';

const findStrikethrough = (contentBlock, callback) => {
  findWithRegex(quoteRE, contentBlock, callback);
};

export default findStrikethrough;
