import React, { Component } from 'react';
import Editor from 'draft-js-plugins-editor';

import createMarkdownShortcutsPlugin from 'draft-js-markdown-shortcuts-plugin'; // eslint-disable-line
import Draft, {
  convertToRaw,
  // convertFromRaw,
  ContentState,
  EditorState,
} from 'draft-js';
import styles from './styles.css';
import prismPlugin from '../../plugins/prism';

window.Draft = Draft;

const plugins = [
  prismPlugin,
  createMarkdownShortcutsPlugin()
];

const contentState = ContentState.createFromText('');
const initialEditorState = EditorState.createWithContent(contentState);

export default class DemoEditor extends Component {

  state = {
    editorState: initialEditorState
  };

  componentDidMount = () => {
    const { editor } = this;
    if (editor) {
      setTimeout(editor.focus.bind(editor), 1000);
    }
  }

  onChange = (editorState) => {
    window.editorState = editorState;
    window.rawContent = convertToRaw(editorState.getCurrentContent());

    this.setState({
      editorState,
    });
  };

  render() {
    const { editorState } = this.state;
    const placeholder = editorState.getCurrentContent().hasText() ? null : <div className={styles.placeholder}>Write something here...</div>;
    return (
      <div className={styles.root}>
        {placeholder}
        <div className={styles.editor} onClick={this.focus}>
          <Editor
            editorState={editorState}
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
