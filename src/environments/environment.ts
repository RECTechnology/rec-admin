import * as pkg from '../../package.json';

export const environment = {
  ...window['__env'],
  version: pkg.version,
};
