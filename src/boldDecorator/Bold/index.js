import React from 'react';
import { bold1, bold2 } from '../regexp';
import replaceLeafContent from '../../utils/replaceLeafContent';

export default class Bold extends React.Component {

  static displayName = 'MarkdownBold';

  render() {
    const { component, children } = this.props;
    if (component) {
      return React.createElement(component, this.props);
    }
    const leaf = children[0];
    return <strong>{replaceLeafContent(leaf, (text) => text.replace(bold1, '$1').replace(bold2, '$1'))}</strong>;
  }
}
