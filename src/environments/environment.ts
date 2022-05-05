import  packageInfo  from '../../package.json';

export const environment = {
  ...window['__env'],
  version: packageInfo .version,
};
