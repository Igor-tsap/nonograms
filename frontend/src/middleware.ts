import createMiddleware from 'next-intl/middleware';
import {routing} from '@/i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for Next.js internals, static files, and backend APIs
  matcher: [
    '/', 
    '/(uk|en)/:path*', 
    '/((?!api|_next|.*\\..*).*)'
  ]
};