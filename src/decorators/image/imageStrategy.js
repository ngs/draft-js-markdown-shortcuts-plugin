const createImageStrategy = ({ entityType }) => {
  const findImageEntities = (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges(character => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === entityType
      );
    }, callback);
  };
  return findImageEntities;
};

export default createImageStrategy;
