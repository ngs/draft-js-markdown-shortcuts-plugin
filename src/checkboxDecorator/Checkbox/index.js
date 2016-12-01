import React, { PropTypes } from 'react';
import setChecked from '../modifiers/setChecked';
import { uncheckedCheckbox, checkedCheckbox } from '../regexp';

let entityKeyIndex = 0;

export default class Checkbox extends React.Component {
  static propTypes = {
    onChangeCheckbox: PropTypes.func
  };

  static displayName = 'MarkdownCheckbox';

  constructor(props) {
    super(props);
    this.entityKey = `md-checkbox-${entityKeyIndex += 1}`;
    this.state = { checked: false };
  }
  onChange(e) {
    const { checked } = e.target;
    this.setState({ checked });
    const { onChangeCheckbox, store } = this.props;
    const { setEditorState, getEditorState } = store;
    const editorState = getEditorState();
    const content = editorState.getCurrentContent();
    console.info(content.getBlockMap());
    const contentBlock = content.getBlockForKey(this.entityKey);
    if (typeof onChangeCheckbox === 'function') {
      onChangeCheckbox(e);
    }
    setEditorState(setChecked(contentBlock, editorState, checked));
  }
  render() {
    const {
      decoratedText = '',
      component,
      onChangeCheckbox, // eslint-disable-line no-unused-vars
      store, // eslint-disable-line no-unused-vars
      dir, // eslint-disable-line no-unused-vars
      entityKey, // eslint-disable-line no-unused-vars
      getEditorState, // eslint-disable-line no-unused-vars
      offsetKey, // eslint-disable-line no-unused-vars
      setEditorState, // eslint-disable-line no-unused-vars
      ...otherProps
    } = this.props;
    const checked = checkedCheckbox.test(decoratedText);
    const text = decoratedText
      .replace(uncheckedCheckbox, '$1')
      .replace(checkedCheckbox, '$1');
    let textIndent = (text.length - decoratedText.length) / 4;
    if (checked) {
      textIndent -= 0.3;
    }
    textIndent = `${textIndent}em`;
    return component ? React.createElement(component, this.props) : (
      <div className={checked ? 'checked' : ''} key={this.entityKey}>
        <input type="checkbox" checked={checked} onChange={(...args) => this.onChange(...args)} readOnly style={{ position: 'relative', top: '-5px' }} />
        <span style={{ textIndent, overflow: 'hidden', display: 'inline-block' }} {...otherProps} />
      </div>
    );
  }
}
