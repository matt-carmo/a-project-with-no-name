import { type NextRequest, NextResponse } from 'next/server';
import { rootDomain } from './lib/utils';

function extractSubdomain(request: NextRequest): string | null {
  const url = request.url;
  
  const host =
    request.headers.get('x-forwarded-host') ||
    request.headers.get('host') ||
    '';
    
  const hostname = host.split(':')[0].toLowerCase();

  // LOCALHOST
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    const match = url.match(/https?:\/\/([^.]+)\.localhost/i);
    if (match?.[1]) return match[1];

    if (hostname.includes('.localhost')) {
      return hostname.split('.')[0];
    }

    return null;
  }

  // PRODUÇÃO
  const root = rootDomain.split(':')[0].toLowerCase();

  // PREVIEW VERCEL — tenant---branch.vercel.app
  if (hostname.includes('---') && hostname.endsWith('.vercel.app')) {
    return hostname.split('---')[0];
  }

  // SUBDOMÍNIO NORMAL
  const isSub =
    hostname !== root &&
    hostname !== `www.${root}` &&
    hostname.endsWith(`.${root}`);

  return isSub ? hostname.replace(`.${root}`, '') : null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const subdomain = extractSubdomain(request);


  if (subdomain) {
    // Block access to admin page from subdomains
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // For the root path on a subdomain, rewrite to the subdomain page
    if (pathname === '/') {
      return NextResponse.rewrite(new URL(`/s/${subdomain}`, request.url));
    }
  }

  // On the root domain, allow normal access
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|[\\w-]+\\.\\w+).*)'
  ]
};