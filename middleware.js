import { NextResponse } from 'next/server';

export function middleware(req) {
  const token = req.cookies.token;

  // Redirect to login if no token is found
  // if (!token) {
  //   return NextResponse.redirect(new URL('/login', req.url));
  // }

  // Continue to the requested page
  return NextResponse.next();
}

// export const config = {
//   matcher: ['/dashboard/:path*'], // Only run middleware for dashboard pages
// };
