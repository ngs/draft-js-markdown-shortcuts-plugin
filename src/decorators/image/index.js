import createImageStrategy from './imageStrategy';

const createImageDecorator = (config, store) => ({
  strategy: createImageStrategy(config, store),
  component: config.imageComponent,
});

export default createImageDecorator;
