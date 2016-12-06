import React, { Component } from 'react';
import Editor from 'draft-js-plugins-editor'; // eslint-disable-line import/no-unresolved
import createMarkdownShortcutsPlugin from 'draft-js-markdown-shortcuts-plugin'; // eslint-disable-line
import {
  // convertToRaw,
  // convertFromRaw,
  ContentState,
  EditorState,
} from 'draft-js';
import styles from './styles.css';
// import initialState from './initialState';

const markdownShortcutsPlugin = createMarkdownShortcutsPlugin({
  onChangeCheckbox: (e) => {
    console.info('Checkbox changed', e); // eslint-disable-line
  }
});

const plugins = [markdownShortcutsPlugin];

// const contentState = ContentState.createFromBlockArray(convertFromRaw(initialState));
const contentState = ContentState.createFromText('');

export default class DemoEditor extends Component {

  state = {
    editorState: EditorState.createWithContent(contentState)
  };

  onChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  render() {
    return (
      <div className={styles.root}>
        <div className={styles.editor} onClick={this.focus}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            plugins={plugins}
            spellCheck
            ref={(element) => { this.editor = element; }}
          />
        </div>
      </div>
    );
  }
}
