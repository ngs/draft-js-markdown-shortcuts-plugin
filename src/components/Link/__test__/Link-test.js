import React from 'react';
import { Entity } from 'draft-js';
import { shallow } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';

import Link from '../';

chai.use(chaiEnzyme());

describe('<Link />', () => {
  it('renders anchor tag', () => {
    const entityKey = Entity.create('LINK', 'MUTABLE', {
      href: 'http://cultofthepartyparrot.com/',
      title: 'parrot'
    });
    expect(
      shallow(<Link entityKey={entityKey}><b>Hello</b></Link>).html()
    ).to.equal(
      '<a href="http://cultofthepartyparrot.com/" title="parrot"><b>Hello</b></a>'
    );
  });
});
