import createLinkStrategy from "./linkStrategy";
import Link from "../../components/Link";

const createLinkDecorator = () => ({
  strategy: createLinkStrategy(),
  component: Link,
});

export default createLinkDecorator;
