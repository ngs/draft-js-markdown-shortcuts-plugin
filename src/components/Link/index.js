import React from 'react';
import { Entity } from 'draft-js';

const Link = (props) => {
  const { href, title } = Entity.get(props.entityKey).getData();
  return (
    <a href={href} title={title}>
      {props.children}
    </a>
  );
};

export default Link;
