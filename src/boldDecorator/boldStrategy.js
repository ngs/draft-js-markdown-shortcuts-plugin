import findWithRegex from 'find-with-regex';
import { bold as boldRE } from './regexp';

const findBold = (contentBlock, callback) => {
  findWithRegex(boldRE, contentBlock, callback);
};

export default findBold;
