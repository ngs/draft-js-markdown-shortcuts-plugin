import React, {useCallback, useState} from 'react';
import Editor from '@draft-js-plugins/editor';

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
import styled from 'styled-components';
import createMarkdownShortcutsPlugin from '../../../..'; // eslint-disable-line

function CustomLink({contentState, children, entityKey}) {
  const {href, title} = contentState.getEntity(entityKey).getData();
  return (
    <a href={href} title={title} rel="noopener noreferrer" target="_blank" style={{color: 'red'}}>
      {children}
    </a>
  );
}

const prismPlugin = createPrismPlugin({
  prism: Prism,
});

window.Draft = Draft;

const defaultPlugins = [prismPlugin, createMarkdownShortcutsPlugin()];
const customElementsPlugins = [prismPlugin, createMarkdownShortcutsPlugin({linkComponent: CustomLink})];

export default function DemoEditor() {
  return (
    <>
      <Example
        autoFocus
        description={<h3>Default settings</h3>}
        plugins={defaultPlugins}
      />
      <Example
        description={<CustomElementsDescription />}
        plugins={customElementsPlugins}
      />
    </>
  );
}

const Example = ({autoFocus, description, plugins}) => {
  const [editorState, setEditorState] = useState(() => {
    const contentState = ContentState.createFromText('take me to [google](http://google.com/)');
    return EditorState.createWithContent(contentState);
  })


  const onChange = useCallback(newEditorState => {
    window.editorState = newEditorState;
    window.rawContent = convertToRaw(newEditorState.getCurrentContent());

    setEditorState(newEditorState);
  }, []);

  return (
    <ExampleContainer>
      <Description>
        {description}
      </Description>
      <EditorContainer>
        <Editor
          autoFocus={autoFocus}
          editorState={editorState}
          onChange={onChange}
          placeholder="Write something here..."
          plugins={plugins}
          spellCheck
        />
      </EditorContainer>
    </ExampleContainer>
  )
}

const CustomElementsDescription = () => {
  return (
    <>
      <h3>Custom elements</h3>
      <p>
        You can have custom links and images passing your own components through the
        {' '}
        <Option>linkComponent</Option>
        {' '}
        and
        {' '}
        <Option>imageComponent</Option>
        {' '}
        options, respectively.
      </p>
    </>
  );
}


const ExampleContainer = styled.div`
  background: #fff;
  display: flex;
  flex-direction: column;
  margin: 10px;
  position: relative;
`;

const EditorContainer = styled.div`
  border: 1px solid #ccc;
  flex-grow: 1;
  padding: 10px;
`;

const Description = styled.div`
  flex-grow: 0;
  margin-bottom: 10px;
`;

const Option = styled.pre`
  display: inline-block;
`;
