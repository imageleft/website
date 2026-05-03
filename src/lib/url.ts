const SITE_HOST = 'imageleft.com';

/**
 * Returns true for any link that doesn't point at imageleft.com itself.
 * That includes:
 *   - non-http schemes that leave the browser (`mailto:`, `tel:`, `sms:`, `wa.me/`)
 *   - http(s) URLs whose host isn't `imageleft.com` (or a subdomain)
 *
 * Relative paths (`/blog`, `#section`, etc.) are always considered internal.
 *
 * Used by `Link.astro` and `Button.astro` to add `target="_blank" rel="noopener noreferrer"`
 * automatically — so consumers don't need to remember per-href.
 */
export function isExternalHref(href: string): boolean {
  if (/^(mailto:|tel:|sms:)/i.test(href)) return true;

  if (/^https?:\/\//i.test(href)) {
    try {
      const url = new URL(href);
      return !url.hostname.endsWith(SITE_HOST);
    } catch {
      return true;
    }
  }

  // Relative path / hash-link — internal.
  return false;
}
