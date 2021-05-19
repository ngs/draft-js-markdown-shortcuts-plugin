import React from 'react';

const Link = ({contentState, children, entityKey}) => {
  const {href, title} = contentState.getEntity(entityKey).getData();
  return (
    <a href={href} title={title}>
      {children}
    </a>
  );
};

export default Link;
