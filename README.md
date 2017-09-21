draft-js-markdown-plugin
==================================

[![npm](https://img.shields.io/npm/v/draft-js-markdown-plugin.svg)][npm]
<!-- [![Coverage Status](https://coveralls.io/repos/github/withspectrum/draft-js-markdown-plugin/badge.svg?branch=master)](https://coveralls.io/github/withspectrum/draft-js-markdown-plugin?branch=master) -->

A [DraftJS] plugin for supporting Markdown syntax shortcuts

This plugin works with [DraftJS Plugins] wrapper component.

![screen](screen.gif)

[View Demo][Demo]

## Usage

```sh
npm i --save draft-js-markdown-plugin
```

then import from your editor component

```js
import createMarkdownPlugin from 'draft-js-markdown-plugin';
```

### Full Example

```js
import React, { Component } from 'react';
import Editor from 'draft-js-plugins-editor';
import createMarkdownPlugin from 'draft-js-markdown-plugin';
import { EditorState } from 'draft-js';

export default class DemoEditor extends Component {

  state = {
    editorState: EditorState.createEmpty(),
    plugins: [createMarkdownPlugin()]
  };

  onChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  render() {
    return (
      <Editor
        editorState={this.state.editorState}
        onChange={this.onChange}
        plugins={this.state.plugins}
      />
    );
  }
}
```

## License

Licensed under the MIT license, Copyright Ⓒ 2017 Space Program Inc. This plugin is forked from the excellent [`draft-js-markdown-shortcuts-plugin`](https://github.com/ngs/draft-js-markdown-shortcuts-plugin) by [Atsushi Nagase](https://github.com/ngs).

See [LICENSE] for the full license text.

## Why fork the `markdown-shortcuts-plugin`?

Writing is a core part of our app, and while the `markdown-shortcuts-plugin` is awesome and battle-tested there are a few opinionated things we wanted to do differently. Rather than bother [@ngs](https://github.com/ngs) with tons of PRs, we figured it'd be better to own that core part of our experience fully. 

[Demo]: https://ngs.github.io/draft-js-markdown-plugin
[DraftJS]: https://facebook.github.io/draft-js/
[DraftJS Plugins]: https://github.com/draft-js-plugins/draft-js-plugins
[LICENSE]: ./LICENSE
[npm]: https://www.npmjs.com/package/draft-js-markdown-plugin
