import createImageStrategy from "./imageStrategy";
import Image from "../../components/Image";

const createImageDecorator = ({ entityType }) => ({
  strategy: createImageStrategy({ entityType }),
  component: Image,
});

export default createImageDecorator;
