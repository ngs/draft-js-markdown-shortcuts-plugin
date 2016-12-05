import React from 'react';
import { Entity } from 'draft-js';

const Image = ({ entityKey, children }) => {
  const { src, alt, title } = Entity.get(entityKey).getData();
  return (
    <span>
      {children}
      <img src={src} alt={alt} title={title} />
    </span>
  );
};

export default Image;
