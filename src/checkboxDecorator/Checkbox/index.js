import React, { PropTypes } from 'react';
import setChecked from '../modifiers/setChecked';
import { uncheckedCheckbox, checkedCheckbox } from '../regexp';
import replaceLeafContent from '../../utils/replaceLeafContent';

export default class Checkbox extends React.Component {
  static propTypes = {
    onChangeCheckbox: PropTypes.func
  };

  static displayName = 'MarkdownCheckbox';

  onChange(e) {
    const { checked } = e.target;
    const { onChangeCheckbox, store, offsetKey } = this.props;
    const { setEditorState, getEditorState } = store;
    const editorState = getEditorState();
    const content = editorState.getCurrentContent();
    const contentBlock = content.getBlockForKey(offsetKey.replace(/^([^-]+)-.*$/, '$1'));
    if (typeof onChangeCheckbox === 'function') {
      onChangeCheckbox(e);
    }
    setEditorState(setChecked(contentBlock, editorState, checked));
  }
  render() {
    const {
      children,
      decoratedText = '',
      component,
    } = this.props;
    if (component) {
      return React.createElement(component, this.props);
    }
    const checked = checkedCheckbox.test(decoratedText);
    const leaf = replaceLeafContent(children[0], (text) => ` ${text
      .replace(uncheckedCheckbox, '$1')
      .replace(checkedCheckbox, '$1')}`);
    return (
      <div className={checked ? 'checked' : ''}>
        <input type="checkbox" checked={checked} onChange={(...args) => this.onChange(...args)} contentEditable="false" />
        {leaf}
      </div>
    );
  }
}
