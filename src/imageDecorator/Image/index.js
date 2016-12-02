import React from 'react';
import { image as imageRE } from '../regexp';
import zeroWidthSpaces from '../../utils/zeroWidthSpaces';

export default class Image extends React.Component {

  static displayName = 'MarkdownImage';

  render() {
    const { component, decoratedText, children } = this.props;
    if (component) {
      return React.createElement(component, this.props);
    }
    const matchArr = new RegExp(imageRE).exec(decoratedText);
    if (!matchArr) {
      return <span>{children}</span>;
    }
    const alt = matchArr[1];
    const src = matchArr[2];
    const title = matchArr[3];
    return (<span>
      <img src={src || ''} alt={alt || ''} title={title || ''} />
      <span>{zeroWidthSpaces(decoratedText.length)}</span>
    </span>);
  }
}
