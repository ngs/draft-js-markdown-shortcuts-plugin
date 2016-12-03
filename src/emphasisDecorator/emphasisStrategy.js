import findWithRegex from 'find-with-regex';
import { emphasis as emphasisRE } from './regexp';

const findEmphasis = (contentBlock, callback) => {
  findWithRegex(emphasisRE, contentBlock, callback);
};

export default findEmphasis;
