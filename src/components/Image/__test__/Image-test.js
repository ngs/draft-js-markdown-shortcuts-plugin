import React from "react";
import { ContentState } from "draft-js";
import { shallow } from "enzyme";

import Image from "../";

describe("<Image />", () => {
  it("renders anchor tag", () => {
    const contentState = ContentState.createFromText(
      ""
    ).createEntity("IMG", "MUTABLE", {
      alt: "alt",
      src: "http://cultofthepartyparrot.com/parrots/aussieparrot.gif",
      title: "parrot",
    });
    const entityKey = contentState.getLastCreatedEntityKey();
    expect(
      shallow(
        <Image entityKey={entityKey} contentState={contentState}>
          &nbsp;
        </Image>
      ).html()
    ).toEqual(
      '<span> <img src="http://cultofthepartyparrot.com/parrots/aussieparrot.gif" alt="alt" title="parrot"/></span>'
    );
  });
});
