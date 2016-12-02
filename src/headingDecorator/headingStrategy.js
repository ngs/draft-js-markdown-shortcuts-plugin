import findWithRegex from 'find-with-regex';
import { heading as headingRE } from './regexp';

const createHeadingStrategoy = (level) => {
  const findHeading = (contentBlock, callback) => {
    if (contentBlock.getType() === 'unstyled') {
      findWithRegex(headingRE[level], contentBlock, callback);
    }
  };
  return findHeading;
};

export default createHeadingStrategoy;
