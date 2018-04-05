import createImageStrategy from "./imageStrategy";
import Image from "../../components/Image";

const createImageDecorator = () => ({
  strategy: createImageStrategy(),
  component: Image,
});

export default createImageDecorator;
