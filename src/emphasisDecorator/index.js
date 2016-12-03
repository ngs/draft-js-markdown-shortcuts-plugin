import decorateComponentWithProps from 'decorate-component-with-props';
import strategy from './emphasisStrategy';
import Emphasis from './Emphasis';

const createHeadingDecorator = () => {
  const component = decorateComponentWithProps(Emphasis, {});
  return { strategy, component };
};

export default createHeadingDecorator;
