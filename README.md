# draft-js-markdown-shortcuts-plugin

![Run tests](https://github.com/ngs/draft-js-markdown-shortcuts-plugin/workflows/Run%20tests/badge.svg)
[![Backers on Open Collective](https://opencollective.com/draft-js-markdown-shortcuts-plugin/backers/badge.svg)](#backers) [![Sponsors on Open Collective](https://opencollective.com/draft-js-markdown-shortcuts-plugin/sponsors/badge.svg)](#sponsors) [![npm](https://img.shields.io/npm/v/draft-js-markdown-shortcuts-plugin.svg)][npm]
[![Coverage Status](https://coveralls.io/repos/github/ngs/draft-js-markdown-shortcuts-plugin/badge.svg?branch=master)](https://coveralls.io/github/ngs/draft-js-markdown-shortcuts-plugin?branch=master)

A [DraftJS] plugin for supporting Markdown syntax shortcuts

This plugin works with [DraftJS Plugins] wrapper component.

![screen](screen.gif)

[View Demo][demo]

## Usage

```sh
npm i --save draft-js-markdown-shortcuts-plugin
```

then import from your editor component

```js
import createMarkdownShortcutsPlugin from 'draft-js-markdown-shortcuts-plugin';
```

## Example

```js
import React, { Component } from 'react';
import Editor from 'draft-js-plugins-editor';
import createMarkdownShortcutsPlugin from 'draft-js-markdown-shortcuts-plugin';
import { EditorState } from 'draft-js';

const plugins = [createMarkdownShortcutsPlugin()];

export default class DemoEditor extends Component {
  state = {
    editorState: EditorState.createEmpty(),
  };

  onChange = editorState => {
    this.setState({
      editorState,
    });
  };

  render() {
    return <Editor editorState={this.state.editorState} onChange={this.onChange} plugins={plugins} />;
  }
}
```

## License

MIT. See [LICENSE]

[demo]: https://ngs.github.io/draft-js-markdown-shortcuts-plugin
[draftjs]: https://facebook.github.io/draft-js/
[draftjs plugins]: https://github.com/draft-js-plugins/draft-js-plugins
[license]: ./LICENSE
[npm]: https://www.npmjs.com/package/draft-js-markdown-shortcuts-plugin
