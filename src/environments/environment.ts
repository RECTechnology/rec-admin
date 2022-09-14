import  packageInfo  from '../../package.json';

export const environment = {
  Brand: {
    title: 'REC Admin',
    name: 'REC',
    header_title: 'REC Admin',
    profile_default_image: '../assets/resources/img/User-default.png',
    account_default_image: '../assets/resources/img/User-default.png',
    no_image_image: '../assets/resources/img/no-image.png',
    suport_url: 'https://rec.barcelona',
    web_url: 'https://rec.barcelona',
    terms_of_service_url: 'https://rec.qbitartifacts.com',
    copyright_year: 'https://rec.qbitartifacts.com',
    logo: '../assets/resources/logo_white.png',
    api_docs_url: 'https://dev.rec.qbitartifacts.com',
    sandbox_front_url: 'https://sandbox.rec.qbitartifacts.com',
},
  ...window['__env'],
  version: packageInfo .version,
};
