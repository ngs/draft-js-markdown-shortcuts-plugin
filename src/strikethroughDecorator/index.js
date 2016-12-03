import decorateComponentWithProps from 'decorate-component-with-props';
import strategy from './strikethroughStrategy';
import Strikethrough from './Strikethrough';

const createHeadingDecorator = () => {
  const component = decorateComponentWithProps(Strikethrough, {});
  return { strategy, component };
};

export default createHeadingDecorator;
