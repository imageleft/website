export interface SEOProps {
  title: string;
  description: string;
  ogImage?: string;
  canonical?: string;
  noindex?: boolean;
}

const SITE = 'https://imageleft.com';
const DEFAULT_OG_IMAGE = '/og/default.png';

export interface ResolvedSEO {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  noindex: boolean;
}

export function buildSEO(props: SEOProps, pathname: string): ResolvedSEO {
  return {
    title: props.title,
    description: props.description,
    canonical: props.canonical ?? `${SITE}${pathname}`,
    ogImage: props.ogImage ?? `${SITE}${DEFAULT_OG_IMAGE}`,
    noindex: props.noindex ?? false,
  };
}
