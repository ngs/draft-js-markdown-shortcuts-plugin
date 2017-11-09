import React from "react";
import { render } from "react-dom";
import GitHubCorner from "react-github-corner";
import DemoEditor from "./components/DemoEditor";

// Import your routes so that you can pass them to the <Router /> component
// eslint-disable-next-line import/no-named-as-default

// Only render in the browser
if (typeof document !== "undefined") {
  render(
    <div style={{ height: "100%" }}>
      <DemoEditor />
      <GitHubCorner
        href="https://github.com/withspectrum/draft-js-markdown-plugin"
        target="_blank"
        direction="right"
      >
        Fork me on GitHub
      </GitHubCorner>
    </div>,
    document.getElementById("root")
  );
}
