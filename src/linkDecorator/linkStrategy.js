import findWithRegex from 'find-with-regex';
import { link as linkRE } from './regexp';

const findLink = (contentBlock, callback) => {
  if (contentBlock.getType() === 'unstyled') {
    findWithRegex(linkRE, contentBlock, callback);
  }
};

export default findLink;
