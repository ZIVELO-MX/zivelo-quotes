import {getRequestConfig} from 'next-intl/server';

const locales = ['en', 'es'];

export default getRequestConfig(async ({locale}) => ({
  messages: (await import(`./messages/${locale}.json`)).default
}));
