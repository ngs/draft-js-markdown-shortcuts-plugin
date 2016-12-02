import decorateComponentWithProps from 'decorate-component-with-props';
import strategy from './imageStrategy';
import Image from './Image';

const createHeadingDecorator = () => {
  const component = decorateComponentWithProps(Image, {});
  return { strategy, component };
};

export default createHeadingDecorator;
