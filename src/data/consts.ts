/* tslint:disable */
import { environment } from '../environments/environment';
let api_url;
let client_id;
let client_secret;

api_url = environment.url;
client_id = environment.clientID;
client_secret = environment.clientSecret;

export let API_URL = api_url;
export let clientID = client_id;
export let clientSecret = client_secret;

export const LANGS = [
  {
    name: 'Español',
    abrev: 'es',
    icon: 'es'
  },
  {
    name: 'English',
    abrev: 'en',
    icon: 'gb'
  },
  {
    name: 'Catalan',
    abrev: 'cat',
    icon: 'cat'
  }
]
export const LANG_MAP = {
  es: LANGS[0],
  en: LANGS[1],
  cat: LANGS[2]
}

export const intervals: any = [
  {
    text: '1 Hours',
    value: 60 * 60 * 1
  },
  {
    text: '2 Hours',
    value: 60 * 60 * 2
  },
  {
    text: '4 Hours',
    value: 60 * 60 * 4
  },
  {
    text: '1 Day',
    value: 60 * 60 * 24
  },
  {
    text: '1 Week',
    value: 60 * 60 * 24 * 7
  },
  {
    text: '1 Month',
    value: 60 * 60 * 24 * 31
  }
];
export const ranges: any = [
  {
    text: 'Last Week',
    value: 7
  },
  {
    text: 'Last 2 Months',
    value: 31 * 2
  },
  {
    text: 'Last 3 Months',
    value: 31 * 3
  },
  {
    text: 'Last 6 Months',
    value: 31 * 6
  },
  {
    text: 'Last Year',
    value: 31 * 12
  },
  {
    text: 'Over All',
    value: 100000000
  },
];

export const defaultInterval = intervals[0];
export const defaultRange = ranges[2];
