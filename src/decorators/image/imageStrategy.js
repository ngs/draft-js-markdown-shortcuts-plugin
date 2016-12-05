import { Entity } from 'draft-js';

const createImageStrategy = () => {
  const findImageEntities = (contentBlock, callback) => {
    contentBlock.findEntityRanges((character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        Entity.get(entityKey).getType() === 'IMG'
      );
    }, callback);
  };
  return findImageEntities;
};

export default createImageStrategy;
