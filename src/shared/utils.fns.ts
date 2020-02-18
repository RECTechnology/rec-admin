export function padStart(n, width, z?) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

export function getDateDMY(date, separator = '/') {
  date = date || new Date();
  const d = date.getDate();
  const m = date.getMonth() + 1;
  const y = date.getFullYear();
  return [y, padStart(m, 2, 0), padStart(d, 2, 0)].join(separator);
}

export function getLocale() {
  const validLocales = [
    'ca',
    'es',
    'en',
  ];

  return (
    validLocales.includes(navigator.languages[0])
      ? navigator.languages[0]
      : 'es');
}
