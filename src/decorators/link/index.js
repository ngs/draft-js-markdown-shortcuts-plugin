import createLinkStrategy from './linkStrategy';

const createLinkDecorator = (config, store) => ({
  strategy: createLinkStrategy(config, store),
  component: config.linkComponent,
});

export default createLinkDecorator;
