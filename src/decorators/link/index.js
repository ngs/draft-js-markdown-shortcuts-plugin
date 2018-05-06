import createLinkStrategy from "./linkStrategy";
import Link from "../../components/Link";

const createLinkDecorator = ({ entityType }) => ({
  strategy: createLinkStrategy({ entityType }),
  component: Link,
});

export default createLinkDecorator;
