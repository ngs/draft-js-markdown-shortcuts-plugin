import React from "react";
import { ContentState } from "draft-js";
import ShallowRenderer from "react-test-renderer/shallow";

const renderer = new ShallowRenderer();

import Link from "../";

describe("<Link />", () => {
  it("renders anchor tag", () => {
    const contentState = ContentState.createFromText(
      ""
    ).createEntity("LINK", "MUTABLE", {
      href: "http://cultofthepartyparrot.com/",
      title: "parrot",
    });
    const entityKey = contentState.getLastCreatedEntityKey();
    renderer.render(
      <Link entityKey={entityKey} contentState={contentState}>
        <b>Hello</b>
      </Link>
    );
    expect(renderer.getRenderOutput()).toEqual(
      <a href="http://cultofthepartyparrot.com/" title="parrot">
        <b>Hello</b>
      </a>
    );
  });
});
