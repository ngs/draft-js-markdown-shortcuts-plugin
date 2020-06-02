import React from 'react';

const Link = props => {
  const { contentState, children, entityKey } = props;
  const { href, title } = contentState.getEntity(entityKey).getData();
  return (
    <a href={href} title={title}>
      {children}
    </a>
  );
};

export default Link;
