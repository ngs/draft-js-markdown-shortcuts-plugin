import React from 'react';
import { Entity } from 'draft-js';
import { shallow } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';

import Image from '../';

chai.use(chaiEnzyme());

describe('<Image />', () => {
  it('renders anchor tag', () => {
    const entityKey = Entity.create('IMG', 'MUTABLE', {
      alt: 'alt',
      src: 'http://cultofthepartyparrot.com/parrots/aussieparrot.gif',
      title: 'parrot'
    });
    expect(
      shallow(<Image entityKey={entityKey}>&nbsp;</Image>).html()
    ).to.equal(
      '<span> <img src="http://cultofthepartyparrot.com/parrots/aussieparrot.gif" alt="alt" title="parrot"/></span>'
    );
  });
});
