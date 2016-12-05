import findWithRegex from 'find-with-regex';
import { emphasis1, emphasis2 } from './regexp';

const findEmphasis = (contentBlock, callback) => {
  findWithRegex(emphasis1, contentBlock, callback);
  findWithRegex(emphasis2, contentBlock, callback);
};

export default findEmphasis;
