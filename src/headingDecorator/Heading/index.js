import React, { PropTypes } from 'react';
import { heading as headingRE } from '../regexp';
import replaceLeafContent from '../../utils/replaceLeafContent';

export default class Heading extends React.Component {
  static propTypes = {
    level: PropTypes.oneOf([1, 2, 3, 4, 5, 6])
  };

  static displayName = 'MarkdownHeading';

  render() {
    const { children, component, level } = this.props;
    if (component) {
      return React.createElement(component, this.props);
    }
    return React.createElement(`h${level}`, {}, replaceLeafContent(children[0], (text) => text.replace(headingRE[level], '$1')));
  }
}
