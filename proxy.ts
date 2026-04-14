import { NextResponse, type NextRequest } from "next/server";
import { isAdminRequest } from "./lib/adminAuth";

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (!pathname.startsWith("/admin")) {
		return NextResponse.next();
	}

	if (pathname === "/admin/login") {
		return NextResponse.next();
	}

	if (isAdminRequest(request)) {
		return NextResponse.next();
	}

	const url = request.nextUrl.clone();
	url.pathname = "/admin/login";
	return NextResponse.redirect(url);
}

export const config = {
	matcher: ["/admin/:path*"],
};
