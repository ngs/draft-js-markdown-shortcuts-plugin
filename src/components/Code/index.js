import React, { PureComponent } from "react";
import { Map } from "immutable";
import { EditorState, EditorBlock, Modifier } from "draft-js";
import enhanceWithClickOutside from "react-click-outside";

const alias = {
  javascript: "js",
  jsx: "js",
};

const CodeSwitchContainer = enhanceWithClickOutside(
  class SwitchContainer extends PureComponent {
    handleClickOutside() {
      this.props.onClickOutside();
    }

    render() {
      return (
        <div contentEditable={false} onClick={this.props.onClick}>
          {this.props.children}
        </div>
      );
    }
  }
);

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
      setReadOnly,
      setEditorState,
    } = this.props.blockProps;

    const editorState = getEditorState();
    const selection = editorState.getSelection();
    const language = ev.currentTarget.value;
    const blockSelection = selection.merge({
      anchorKey: blockKey,
      focusKey: blockKey,
    });

    this.setState({ isOpen: false });

    let content = editorState.getCurrentContent();
    content = Modifier.mergeBlockData(
      content,
      blockSelection,
      Map({ language })
    );
    setReadOnly(false);

    const newEditorState = EditorState.push(
      editorState,
      content,
      "change-block-data"
    );

    setEditorState(EditorState.forceSelection(newEditorState, selection));
  };

  cancelClicks = event => event.preventDefault();

  onSelectClick = event => {
    this.setState({ isOpen: true });
    const { setReadOnly } = this.props.blockProps;
    event.stopPropagation();
    setReadOnly(true);
    this.setState({
      isOpen: true,
    });
  };

  onClickOutside = () => {
    if (this.state.isOpen === false) return;
    this.setState({
      isOpen: false,
    });
    const {
      getEditorState,
      setReadOnly,
      setEditorState,
    } = this.props.blockProps;

    setReadOnly(false);

    this.setState({ isOpen: false });

    const editorState = getEditorState();
    const selection = editorState.getSelection();

    setEditorState(EditorState.forceSelection(editorState, selection));
  };

  render() {
    const {
      languages,
      renderLanguageSelect,
      getReadOnly,
      language: _language,
    } = this.props.blockProps;

    const language = alias[_language] || _language;
    const selectedLabel = languages[language];
    const selectedValue = language;

    const options = Object.keys(languages).reduce(
      (acc, val) => [
        ...acc,
        {
          label: languages[val],
          value: val,
        },
      ],
      []
    );

    return (
      <div>
        <EditorBlock {...this.props} />
        <CodeSwitchContainer
          onClickOutside={this.onClickOutside}
          onClick={this.onSelectClick}
        >
          {!getReadOnly() &&
            renderLanguageSelect({
              selectedLabel,
              selectedValue,
              onChange: this.onChange,
              options,
            })}
        </CodeSwitchContainer>
      </div>
    );
  }
}

export default CodeBlock;
