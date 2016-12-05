import { Entity } from 'draft-js';

const createLinkStrategy = () => {
  const findLinkEntities = (contentBlock, callback) => {
    contentBlock.findEntityRanges((character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        Entity.get(entityKey).getType() === 'LINK'
      );
    }, callback);
  };
  return findLinkEntities;
};

export default createLinkStrategy;
