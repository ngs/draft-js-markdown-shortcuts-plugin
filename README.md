draft-js-markdown-shortcuts-plugin
==================================

[![CircleCI](https://circleci.com/gh/ngs/draft-js-markdown-shortcuts-plugin.svg?style=svg)](https://circleci.com/gh/ngs/draft-js-markdown-shortcuts-plugin)
[![Backers on Open Collective](https://opencollective.com/draft-js-markdown-shortcuts-plugin/backers/badge.svg)](#backers) [![Sponsors on Open Collective](https://opencollective.com/draft-js-markdown-shortcuts-plugin/sponsors/badge.svg)](#sponsors) [![npm](https://img.shields.io/npm/v/draft-js-markdown-shortcuts-plugin.svg)][npm]
[![Coverage Status](https://coveralls.io/repos/github/ngs/draft-js-markdown-shortcuts-plugin/badge.svg?branch=master)](https://coveralls.io/github/ngs/draft-js-markdown-shortcuts-plugin?branch=master)

A [DraftJS] plugin for supporting Markdown syntax shortcuts

This plugin works with [DraftJS Plugins] wrapper component.

![screen](screen.gif)

[View Demo][Demo]

Usage
-----

```sh
npm i --save draft-js-markdown-shortcuts-plugin
```

then import from your editor component

```js
import createMarkdownShortcutsPlugin from 'draft-js-markdown-shortcuts-plugin';
```

Example
-------

```js
import React, { Component } from 'react';
import Editor from 'draft-js-plugins-editor';
import createMarkdownShortcutsPlugin from 'draft-js-markdown-shortcuts-plugin';
import { EditorState } from 'draft-js';

const plugins = [
  createMarkdownShortcutsPlugin()
];

export default class DemoEditor extends Component {

  state = {
    editorState: EditorState.createEmpty(),
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
        plugins={plugins}
      />
    );
  }
}
```

License
-------

MIT. See [LICENSE]

[Demo]: https://ngs.github.io/draft-js-markdown-shortcuts-plugin
[DraftJS]: https://facebook.github.io/draft-js/
[DraftJS Plugins]: https://github.com/draft-js-plugins/draft-js-plugins
[LICENSE]: ./LICENSE
[npm]: https://www.npmjs.com/package/draft-js-markdown-shortcuts-plugin

## Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].
<a href="graphs/contributors"><img src="https://opencollective.com/draft-js-markdown-shortcuts-plugin/contributors.svg?width=890&button=false" /></a>


## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/draft-js-markdown-shortcuts-plugin#backer)]

<a href="https://opencollective.com/draft-js-markdown-shortcuts-plugin#backers" target="_blank"><img src="https://opencollective.com/draft-js-markdown-shortcuts-plugin/backers.svg?width=890"></a>


## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/draft-js-markdown-shortcuts-plugin#sponsor)]

<a href="https://opencollective.com/draft-js-markdown-shortcuts-plugin/sponsor/0/website" target="_blank"><img src="https://opencollective.com/draft-js-markdown-shortcuts-plugin/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/draft-js-markdown-shortcuts-plugin/sponsor/1/website" target="_blank"><img src="https://opencollective.com/draft-js-markdown-shortcuts-plugin/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/draft-js-markdown-shortcuts-plugin/sponsor/2/website" target="_blank"><img src="https://opencollective.com/draft-js-markdown-shortcuts-plugin/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/draft-js-markdown-shortcuts-plugin/sponsor/3/website" target="_blank"><img src="https://opencollective.com/draft-js-markdown-shortcuts-plugin/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/draft-js-markdown-shortcuts-plugin/sponsor/4/website" target="_blank"><img src="https://opencollective.com/draft-js-markdown-shortcuts-plugin/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/draft-js-markdown-shortcuts-plugin/sponsor/5/website" target="_blank"><img src="https://opencollective.com/draft-js-markdown-shortcuts-plugin/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/draft-js-markdown-shortcuts-plugin/sponsor/6/website" target="_blank"><img src="https://opencollective.com/draft-js-markdown-shortcuts-plugin/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/draft-js-markdown-shortcuts-plugin/sponsor/7/website" target="_blank"><img src="https://opencollective.com/draft-js-markdown-shortcuts-plugin/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/draft-js-markdown-shortcuts-plugin/sponsor/8/website" target="_blank"><img src="https://opencollective.com/draft-js-markdown-shortcuts-plugin/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/draft-js-markdown-shortcuts-plugin/sponsor/9/website" target="_blank"><img src="https://opencollective.com/draft-js-markdown-shortcuts-plugin/sponsor/9/avatar.svg"></a>


