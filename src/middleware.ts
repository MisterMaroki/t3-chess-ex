import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
	async function middleware(req) {
		const pathname = req.nextUrl.pathname;

		// Manage route protection
		const isAuthed = await getToken({ req });
		const isLoginPage = pathname.startsWith('/login');

		const sensitiveRoutes = ['/home', '/chess'];
		const isAccessingSensitiveRoute = sensitiveRoutes.some((route) =>
			pathname?.startsWith(route)
		);

		if (isLoginPage) {
			if (isAuthed) {
				return NextResponse.redirect(new URL('/home', req.url));
			}

			return NextResponse.next();
		}

		if (!isAuthed && isAccessingSensitiveRoute) {
			return NextResponse.redirect(new URL('/login', req.url));
		}
	},
	{
		callbacks: {
			async authorized() {
				return true;
			},
		},
	}
);

export const config = {
	matchter: ['/login', '/home/:path*'],
};
