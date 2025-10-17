import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'ro', 'fr', 'ru', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'always'
});

export const config = {
  matcher: [
    // Match all pathnames except for
    // - internal paths
    // - paths with a file extension
    '/((?!_next|.*\..*).*)'
  ]
};
