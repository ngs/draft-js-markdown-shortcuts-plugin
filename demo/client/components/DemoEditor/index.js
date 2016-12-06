import React, { Component } from 'react';
import Editor from 'draft-js-plugins-editor';
import PrismDecorator from 'draft-js-prism';
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

import createMarkdownShortcutsPlugin from 'draft-js-markdown-shortcuts-plugin'; // eslint-disable-line
import {
  // convertToRaw,
  // convertFromRaw,
  ContentState,
  EditorState,
} from 'draft-js';
import styles from './styles.css';
// import initialState from './initialState';

const plugins = [createMarkdownShortcutsPlugin()];

const decorators = [
  new PrismDecorator({
    getSyntax(block) {
      const language = block.getData().get('language');
      if (typeof Prism.languages[language] === 'object') {
        return language;
      }
      return null;
    },
    render({ type, children }) {
      return <span className={`prism-token token ${type}`}>{children}</span>;
    }
  })
];

// const contentState = ContentState.createFromBlockArray(convertFromRaw(initialState));
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
            decorators={decorators}
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
