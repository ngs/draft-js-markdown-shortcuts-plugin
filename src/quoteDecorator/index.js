import decorateComponentWithProps from 'decorate-component-with-props';
import strategy from './quoteStrategy';
import Quote from './Quote';

const createHeadingDecorator = () => {
  const component = decorateComponentWithProps(Quote, {});
  return { strategy, component };
};

export default createHeadingDecorator;
