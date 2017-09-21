import React from "react";
import { render } from "react-dom";
import Ribbon from "react-github-fork-ribbon";
import DemoEditor from "./components/DemoEditor";

// Import your routes so that you can pass them to the <Router /> component
// eslint-disable-next-line import/no-named-as-default

// Only render in the browser
if (typeof document !== "undefined") {
  render(
    <div>
      <Ribbon
        href="https://github.com/ngs/draft-js-markdown-shortcuts-plugin/"
        target="_blank"
        position="right"
        color="black"
      >
        Fork me on GitHub
      </Ribbon>
      <DemoEditor />
    </div>,
    document.getElementById("root")
  );
}
