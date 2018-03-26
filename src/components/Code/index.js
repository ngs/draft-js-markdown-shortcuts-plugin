import React, { PureComponent } from "react";
import { Map } from "immutable";
import { EditorState, EditorBlock, Modifier } from "draft-js";

const languages = {
  bash: "Bash",
  c: "C",
  cpp: "C++",
  css: "CSS",
  go: "Go",
  html: "HTML",
  java: "Java",
  javascript: "JavaScript",
  js: "JavaScript",
  kotlin: "Kotlin",
  mathml: "MathML",
  perl: "Perl",
  ruby: "Ruby",
  scala: "Scala",
  sql: "SQL",
  svg: "SVG",
  swift: "Swift",
};

class CodeBlock extends PureComponent {
  onChange = ev => {
    ev.preventDefault();
    const blockKey = this.props.block.getKey();
    const { getEditorState, setEditorState } = this.props.blockProps;
    const editorState = getEditorState();
    const selection = editorState.getSelection();
    const language = ev.currentTarget.value;

    let content = editorState.getCurrentContent();
    content = Modifier.mergeBlockData(content, selection, Map({ language }));

    const newEditorState = EditorState.push(
      editorState,
      content,
      "change-block-data"
    );

    // setTimeout(() => {
    //   setEditorState(EditorState.forceSelection(
    //     newEditorState,
    //     content.getSelectionAfter()
    //   ))
    // }, 3000)
  };

  render() {
    const { language } = this.props.blockProps;

    return (
      <div>
        <EditorBlock {...this.props} />
        <div contentEditable={false}>
          <select value={language} onChange={this.onChange}>
            {Object.keys(this.props.languages).map(lang => (
              <option key={lang} value={lang}>
                {this.props.languages[lang]}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }
}

CodeBlock.defaultProps = {
  languages,
};

export default CodeBlock;
