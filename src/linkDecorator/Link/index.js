import React from 'react';
import { link as linkRE } from '../regexp';
import replaceLeafContent from '../../utils/replaceLeafContent';

export default class Link extends React.Component {

  static displayName = 'MarkdownLink';

  render() {
    const { children, component, decoratedText } = this.props;
    if (component) {
      return React.createElement(component, this.props);
    }
    const matchArr = linkRE.exec(decoratedText);
    const leaf = children[0];
    const [
      _text, // eslint-disable-line no-unused-vars
      url,
      title
    ] = matchArr;
    return <a href={url} title={title}>{replaceLeafContent(leaf, (text) => text.replace(linkRE, '$1'))}</a>;
  }
}
