import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'uk'],

  // Used when no locale matches
  defaultLocale: 'en'
});

// Lightweight wrappers around Next.js's navigation APIs
// that will automatically consider the current locale
export const {Link, redirect, usePathname, useRouter} = createNavigation(routing);