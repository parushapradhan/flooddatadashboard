import { NextResponse } from "next/server";
import { NextRequest } from "next/server";


export const USER_ROLES = {
    ADMIN: 'admin',
    GUEST: "guest",
    AUTHENTICATED: "authenticated"
} as const

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]


const ROLE_ROUTES: Record<UserRole, string[]> = {
    [USER_ROLES.ADMIN]: ['/register'],
    [USER_ROLES.GUEST]: ['/pool']
}

// Update this function to choose the user
function get_user_role(token: String) {
    return USER_ROLES.ADMIN
}

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    const isPublicPath = path === '/login'

    // NOTE(parusha):
    // Handle any routing based on the user (Route to the login if not signed in/Token expired)
    // IDK how you doing the user setting set the value to a variable and return the ROLE_ROUTES
    const userRole = get_user_role("")

    if (userRole) {
        const allowedRoutes = ROLE_ROUTES[userRole]
        const isAuthorized = allowedRoutes.some(route => path.startsWith(route))

        if (!isAuthorized && !isPublicPath) {
            // Add Routing to default un authorized page
        }
    }

    return NextResponse.next()
}


export const config = {
    matcher: [
      '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ]
  }
