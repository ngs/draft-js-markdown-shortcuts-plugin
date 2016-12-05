import findWithRegex from 'find-with-regex';
import { bold1, bold2 } from './regexp';

const findBold = (contentBlock, callback) => {
  findWithRegex(bold1, contentBlock, callback);
  findWithRegex(bold2, contentBlock, callback);
};

export default findBold;
