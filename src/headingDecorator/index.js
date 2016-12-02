import decorateComponentWithProps from 'decorate-component-with-props';
import createHeadingStrategoy from './headingStrategy';
import Heading from './Heading';

const createHeadingDecorator = ({ level }) => {
  const component = decorateComponentWithProps(Heading, { level });
  const strategy = createHeadingStrategoy(level);
  return { strategy, component };
};

export default createHeadingDecorator;
