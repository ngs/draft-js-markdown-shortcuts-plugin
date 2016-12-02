import decorateComponentWithProps from 'decorate-component-with-props';
import strategy from './boldStrategy';
import Bold from './Bold';

const createHeadingDecorator = () => {
  const component = decorateComponentWithProps(Bold, {});
  return { strategy, component };
};

export default createHeadingDecorator;
