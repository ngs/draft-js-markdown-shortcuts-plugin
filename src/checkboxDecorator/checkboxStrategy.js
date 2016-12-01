import findWithRegex from 'find-with-regex';
import { checkedCheckbox, uncheckedCheckbox } from './regexp';

const findCheckbox = (contentBlock, callback) => {
  if (contentBlock.getType() === 'unstyled') {
    findWithRegex(checkedCheckbox, contentBlock, callback);
    findWithRegex(uncheckedCheckbox, contentBlock, callback);
  }
};

export default findCheckbox;
