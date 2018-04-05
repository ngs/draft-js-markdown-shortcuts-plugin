import React, { PureComponent } from "react";
import { Map } from "immutable";
import { EditorState, EditorBlock, Modifier } from "draft-js";
import Modal from "react-modal";

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

const hidden = {};

class CodeBlock extends PureComponent {
  state = {
    isOpen: false,
  };

  onChange = ev => {
    ev.preventDefault();
    ev.stopPropagation();
    const blockKey = this.props.block.getKey();
    const {
      getEditorState,
      setEditorState,
      getEditorRef,
    } = this.props.blockProps;
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

    setTimeout(() => {
      setEditorState(
        EditorState.forceSelection(newEditorState, content.getSelectionAfter())
      );
    }, 2);
  };

  cancelClicks = event => event.preventDefault();

  preventBubbling = event => event.stopPropagation();

  wat = () => {
    console.log("yo wtf");
  };

  render() {
    const { language } = this.props.blockProps;

    return (
      <div>
        <EditorBlock {...this.props} />
        <div>
          <select
            contentEditable={false}
            onClick={this.preventBubbling}
            value={language}
            onChange={this.onChange}
          >
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
