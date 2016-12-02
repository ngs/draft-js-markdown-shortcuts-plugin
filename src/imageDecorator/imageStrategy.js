import findWithRegex from 'find-with-regex';
import { image as imageRE } from './regexp';

const findImage = (contentBlock, callback) => {
  if (contentBlock.getType() === 'unstyled') {
    findWithRegex(imageRE, contentBlock, callback);
  }
};

export default findImage;
