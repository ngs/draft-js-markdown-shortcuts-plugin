import React, { Component } from 'react';
import Editor from 'draft-js-plugins-editor';

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
import createMarkdownShortcutsPlugin from '../../../..'; // eslint-disable-line
import styled from 'styled-components';

const prismPlugin = createPrismPlugin({
  prism: Prism,
});

window.Draft = Draft;

const plugins = [prismPlugin, createMarkdownShortcutsPlugin()];

export default class DemoEditor extends Component {
  constructor(props) {
    super(props);
    const contentState = ContentState.createFromText('');
    const editorState = EditorState.createWithContent(contentState);
    this.state = { editorState };
  }

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
      <Placeholder>Write something here...</Placeholder>
    );
    return (
      <Root>
        {placeholder}
        <EditorContainer onClick={this.focus} onKeyDown={this.focus}>
          <Editor
            editorState={editorState}
            onChange={this.onChange}
            plugins={plugins}
            spellCheck
            ref={element => {
              this.editor = element;
            }}
          />
        </EditorContainer>
      </Root>
    );
  }
}

const Root = styled.div`
  background: #fff;
  height: 100%;
  position: relative;
`;

const Placeholder = styled.div`
  color: #ccc;
  font-size: 1em;
  position: absolute;
  width: 95%;
  top: 0;
  left: 2.5%;
`;

const EditorContainer = styled.div`
  margin: 2.5% auto 0 auto;
  height: 95%;
  width: 95%;
`;
