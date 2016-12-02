import decorateComponentWithProps from 'decorate-component-with-props';
import strategy from './linkStrategy';
import Link from './Link';

const createHeadingDecorator = () => {
  const component = decorateComponentWithProps(Link, {});
  return { strategy, component };
};

export default createHeadingDecorator;
