import React, { PropTypes } from 'react';
// import { SelectionState } from 'draft-js';
import setChecked from '../modifiers/setChecked';
import { uncheckedCheckbox, checkedCheckbox } from '../regexp';

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
    const checked = checkedCheckbox.test(decoratedText);
    const text = decoratedText
      .replace(uncheckedCheckbox, '$1')
      .replace(checkedCheckbox, '$1');
    const child = children[0];
    const {
      decoratedText: decoratedText2, // eslint-disable-line no-unused-vars
      ...childProps
    } = child.props;
    childProps.text = `\u200B\u200B\u200B\u200B\u200B ${text}`;
    return component ? React.createElement(component, this.props) : (
      <div className={checked ? 'checked' : ''}>
        <input type="checkbox" checked={checked} onChange={(...args) => this.onChange(...args)} contentEditable="false" />
        {React.createElement(child.type, childProps)}
      </div>
    );
  }
}
