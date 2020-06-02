import React, { Component } from 'react';
import Editor from 'draft-js-plugins-editor';

import createMarkdownShortcutsPlugin from 'draft-js-markdown-shortcuts-plugin'; // eslint-disable-line
import Draft, {
  convertToRaw,
  // convertFromRaw,
  ContentState,
  EditorState,
} from 'draft-js';
import Prism from 'prismjs';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-scala';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-kotlin';
import 'prismjs/components/prism-perl';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-swift';
import createPrismPlugin from 'draft-js-prism-plugin';
import styles from './styles.css';

const prismPlugin = createPrismPlugin({
  prism: Prism,
});

window.Draft = Draft;

const plugins = [prismPlugin, createMarkdownShortcutsPlugin()];

const contentState = ContentState.createFromText('');
const initialEditorState = EditorState.createWithContent(contentState);

export default class DemoEditor extends Component {
  state = {
    editorState: initialEditorState,
  };

  componentDidMount = () => {
    const { editor } = this;
    if (editor) {
      setTimeout(editor.focus.bind(editor), 1000);
    }
  };

  onChange = editorState => {
    window.editorState = editorState;
    window.rawContent = convertToRaw(editorState.getCurrentContent());

    this.setState({
      editorState,
    });
  };

  render() {
    const { editorState } = this.state;
    const placeholder = editorState.getCurrentContent().hasText() ? null : (
      <div className={styles.placeholder}>Write something here...</div>
    );
    return (
      <div className={styles.root}>
        {placeholder}
        <div className={styles.editor} onClick={this.focus}>
          <Editor
            editorState={editorState}
            onChange={this.onChange}
            plugins={plugins}
            spellCheck
            ref={element => {
              this.editor = element;
            }}
          />
        </div>
      </div>
    );
  }
}
