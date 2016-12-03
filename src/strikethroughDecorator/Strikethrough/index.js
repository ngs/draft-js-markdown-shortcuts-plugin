import React from 'react';
import { strikethrough as strikethroughRE } from '../regexp';
import replaceLeafContent from '../../utils/replaceLeafContent';

export default class Strikethrough extends React.Component {

  static displayName = 'MarkdownStrikethrough';

  render() {
    const { component, children } = this.props;
    if (component) {
      return React.createElement(component, this.props);
    }
    const leaf = children[0];
    return <del>{replaceLeafContent(leaf, (text) => text.replace(strikethroughRE, '$2'))}</del>;
  }
}
