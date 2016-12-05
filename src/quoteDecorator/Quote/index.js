import React from 'react';
import { quote as quoteRE } from '../regexp';
import replaceLeafContent from '../../utils/replaceLeafContent';

export default class Quote extends React.Component {

  static displayName = 'MarkdownQuote';

  render() {
    const { component, children } = this.props;
    if (component) {
      return React.createElement(component, this.props);
    }
    const leaf = children[0];
    return <q>{replaceLeafContent(leaf, (text) => text.replace(quoteRE, '$1'))}</q>;
  }
}
