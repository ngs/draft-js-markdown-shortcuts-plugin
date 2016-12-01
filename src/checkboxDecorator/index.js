import decorateComponentWithProps from 'decorate-component-with-props';
import strategy from './checkboxStrategy';
import Checkbox from './Checkbox';

const createCheckboxDecorator = ({ onChangeCheckbox }, store) => {
  const component = decorateComponentWithProps(Checkbox, { onChangeCheckbox, store });
  return { strategy, component };
};

export default createCheckboxDecorator;
